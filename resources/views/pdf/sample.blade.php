<h1>{{ $title }}</h1>
<p>mPDFで生成したサンプルPDFです。生成日時: {{ $generatedAt }}</p>

<h2>日本語表示の確認</h2>
<p>mPDFはUTF-8のHTMLを直接PDFに変換できるため、日本語や絵文字を含むテキストも追加のフォント設定なしで表示できます。</p>

<h2>テーブルの例</h2>
<table>
    <thead>
        <tr>
            <th>項目</th>
            <th>内容</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>ライブラリ</td>
            <td>mpdf/mpdf</td>
        </tr>
        <tr>
            <td>入力</td>
            <td>HTML (Bladeテンプレート)</td>
        </tr>
        <tr>
            <td>出力</td>
            <td>PDF</td>
        </tr>
    </tbody>
</table>
