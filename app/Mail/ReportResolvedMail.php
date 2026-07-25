<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReportResolvedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $targetTypeLabel;
    public $targetName;
    public $resolveReason;

    /**
     * Create a new message instance.
     */
    public function __construct($targetTypeLabel, $targetName, $resolveReason = null)
    {
        $this->targetTypeLabel = $targetTypeLabel;
        $this->targetName = $targetName;
        $this->resolveReason = $resolveReason;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Thông báo: Nội dung của bạn đã bị gỡ bỏ do vi phạm tiêu chuẩn cộng đồng',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.report-resolved',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
