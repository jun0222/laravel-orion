<?php

namespace App\Livewire\Blade;

use Livewire\Attributes\Layout;
use Livewire\Component;
use Mpdf\HTMLParserMode;
use Mpdf\Mpdf;
use Symfony\Component\HttpFoundation\StreamedResponse;

#[Layout('layouts.blade')]
class PdfSample extends Component
{
    public string $title = 'mPDF サンプル';

    public function download(): StreamedResponse
    {
        $this->validate([
            'title' => 'required|string|max:200',
        ]);

        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
        ]);
        $mpdf->autoScriptToLang = true;
        $mpdf->autoLangToFont = true;

        $css = file_get_contents(resource_path('css/pdf/sample.css'));
        $html = view('pdf.sample', [
            'title' => $this->title,
            'generatedAt' => now()->format('Y-m-d H:i'),
        ])->render();

        $mpdf->WriteHTML($css, HTMLParserMode::HEADER_CSS);
        $mpdf->WriteHTML($html, HTMLParserMode::HTML_BODY);

        return response()->streamDownload(
            fn () => print($mpdf->Output('', 'S')),
            'sample.pdf',
            ['Content-Type' => 'application/pdf'],
        );
    }

    public function render()
    {
        return view('livewire.blade.pdf-sample');
    }
}
