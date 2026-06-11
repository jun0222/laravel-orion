<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use League\CommonMark\CommonMarkConverter;

class MarkdownPdfController extends Controller
{
    public function convert(Request $request)
    {
        $request->validate(['markdown' => 'required|string|max:100000']);

        $converter = new CommonMarkConverter([
            'html_input'         => 'strip',
            'allow_unsafe_links' => false,
        ]);

        $html = $converter->convert($request->input('markdown'))->getContent();

        $pdf = Pdf::loadView('pdf.markdown', ['content' => $html])
            ->setPaper('a4', 'portrait');

        return $pdf->download('document.pdf');
    }
}
