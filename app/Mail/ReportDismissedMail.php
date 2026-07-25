<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReportDismissedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $targetTypeLabel;
    public $targetName;
    public $dismissReason;

    /**
     * Create a new message instance.
     */
    public function __construct($targetTypeLabel, $targetName, $dismissReason)
    {
        $this->targetTypeLabel = $targetTypeLabel;
        $this->targetName = $targetName;
        $this->dismissReason = $dismissReason;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Phản hồi về Báo cáo của bạn từ Ban quản trị EduFlow',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.report-dismissed',
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
