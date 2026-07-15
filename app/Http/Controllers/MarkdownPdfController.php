<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use League\CommonMark\CommonMarkConverter;
use Mpdf\Mpdf;

class MarkdownPdfController extends Controller
{
    public function convert(Request $request)
    {
        $request->validate([
            'markdown'   => 'required|string|max:100000',
            'title'      => 'nullable|string|max:200',
            'paper_size' => 'nullable|in:a4,letter',
        ]);

        $converter = new CommonMarkConverter([
            'html_input'         => 'strip',
            'allow_unsafe_links' => false,
        ]);

        $content  = $converter->convert($request->input('markdown'))->getContent();
        $title    = $request->input('title', 'Untitled');
        $paper    = strtoupper($request->input('paper_size', 'a4'));
        $date     = now()->format('Y-m-d');
        $filename = preg_replace('/[^\w\- ]/u', '', $title) ?: 'document';

        $mpdf = new Mpdf([
            'mode'          => 'utf-8',
            'format'        => $paper,
            'margin_top'    => 25,
            'margin_bottom' => 22,
            'margin_left'   => 20,
            'margin_right'  => 20,
            'margin_header' => 8,
            'margin_footer' => 8,
        ]);

        $mpdf->autoScriptToLang = true;
        $mpdf->autoLangToFont   = true;

        $mpdf->SetHTMLHeader('
            <table width="100%" style="border-bottom: 2px solid #6366f1; padding-bottom: 4px; font-family: sans-serif;">
                <tr>
                    <td style="font-size: 10pt; font-weight: bold; color: #4f46e5;">' . htmlspecialchars($title) . '</td>
                    <td align="right" style="font-size: 9pt; color: #9ca3af;">' . $date . '</td>
                </tr>
            </table>
        ');

        $mpdf->SetHTMLFooter('
            <table width="100%" style="border-top: 1px solid #e5e7eb; padding-top: 4px; font-family: sans-serif;">
                <tr>
                    <td style="font-size: 8pt; color: #d1d5db;">laravel-orion</td>
                    <td align="right" style="font-size: 8pt; color: #9ca3af;">Page {PAGENO} of {nbpg}</td>
                </tr>
            </table>
        ');

        $mpdf->WriteHTML(view('pdf.markdown', compact('content'))->render());

        return response($mpdf->Output('', 'S'), 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"{$filename}.pdf\"",
        ]);
    }
}
