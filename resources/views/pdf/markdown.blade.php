<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<style>
  body {
    font-family: DejaVu Sans, sans-serif;
    font-size: 13px;
    line-height: 1.7;
    color: #1f2937;
    margin: 0;
    padding: 40px 50px;
  }
  h1 { font-size: 26px; font-weight: 700; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 16px; }
  h2 { font-size: 20px; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 28px; }
  h3 { font-size: 16px; font-weight: 700; margin-top: 20px; }
  p  { margin: 12px 0; }
  ul, ol { padding-left: 24px; margin: 10px 0; }
  li { margin: 4px 0; }
  code {
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    padding: 1px 5px;
    font-size: 12px;
  }
  pre {
    background: #1f2937;
    color: #f9fafb;
    border-radius: 6px;
    padding: 16px;
    overflow: hidden;
    margin: 16px 0;
  }
  pre code { background: none; border: none; padding: 0; color: inherit; }
  blockquote {
    border-left: 4px solid #6366f1;
    padding-left: 16px;
    margin: 16px 0;
    color: #6b7280;
  }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
  th { background: #f9fafb; font-weight: 700; }
  a  { color: #6366f1; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
</style>
</head>
<body>
  {!! $content !!}
</body>
</html>
