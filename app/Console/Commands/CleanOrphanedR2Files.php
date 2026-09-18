<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Video;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanOrphanedR2Files extends Command
{
    protected $signature = 'r2:clean-orphaned
                            {--dry-run : Chỉ liệt kê file rác, không xóa}
                            {--prefix=lessons/ : Prefix thư mục cần quét trên R2}';

    protected $description = 'Dọn dẹp file rác trên Cloudflare R2 (file tồn tại trên R2 nhưng không có record trong DB)';

    public function handle(): int
    {
        $dryRun = $this->option('dry-run');
        $prefix = $this->option('prefix');

        $this->info($dryRun ? '🔍 [DRY RUN] Đang quét file rác...' : '🗑️ Đang quét và xóa file rác...');

        $disk = Storage::disk('r2');

        // Lấy tất cả r2_key đang có trong DB
        $knownKeys = Video::whereNotNull('r2_key')
            ->pluck('r2_key')
            ->flip()
            ->toArray();

        $this->info('📦 Số video hợp lệ trong DB: ' . count($knownKeys));

        // Liệt kê tất cả file trên R2 theo prefix
        $allFiles = $disk->files($prefix);
        $this->info('☁️  Số file trên R2 (prefix: ' . $prefix . '): ' . count($allFiles));

        $orphaned = [];

        foreach ($allFiles as $file) {
            if (!isset($knownKeys[$file])) {
                $orphaned[] = $file;
            }
        }

        if (empty($orphaned)) {
            $this->info('✅ Không có file rác nào!');
            return self::SUCCESS;
        }

        $this->warn('⚠️  Tìm thấy ' . count($orphaned) . ' file rác:');

        $totalBytes = 0;

        foreach ($orphaned as $file) {
            $size = $disk->size($file);
            $totalBytes += $size;
            $sizeFormatted = $this->formatBytes($size);
            $lastModified = date('Y-m-d H:i:s', $disk->lastModified($file));

            $this->line("   - {$file} ({$sizeFormatted}, {$lastModified})");
        }

        $this->info('📊 Tổng dung lượng rác: ' . $this->formatBytes($totalBytes));

        if ($dryRun) {
            $this->warn('ℹ️  Chạy lại không có --dry-run để xóa.');
            return self::SUCCESS;
        }

        if (!$this->confirm('Bạn có chắc muốn xóa ' . count($orphaned) . ' file rác không?')) {
            $this->info('❌ Đã hủy.');
            return self::SUCCESS;
        }

        $bar = $this->output->createProgressBar(count($orphaned));
        $bar->start();

        $deleted = 0;
        $failed = 0;

        foreach ($orphaned as $file) {
            try {
                $disk->delete($file);
                $deleted++;
            } catch (\Throwable $e) {
                $failed++;
                $this->newLine();
                $this->error("   Lỗi xóa {$file}: {$e->getMessage()}");
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("✅ Đã xóa: {$deleted} file");
        if ($failed > 0) {
            $this->error("❌ Lỗi: {$failed} file");
        }
        $this->info('💾 Đã giải phóng: ' . $this->formatBytes($totalBytes));

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }

    private function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $index = 0;
        $size = (float) $bytes;

        while ($size >= 1024 && $index < count($units) - 1) {
            $size /= 1024;
            $index++;
        }

        return round($size, 2) . ' ' . $units[$index];
    }
}
