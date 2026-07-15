<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<style>
body {
  font-family: sans-serif;
  font-size: 11pt;
  line-height: 1.8;
  color: #1f2937;
}
h1 {
  font-size: 20pt;
  font-weight: bold;
  color: #111827;
  border-bottom: 2px solid #6366f1;
  padding-bottom: 6px;
  margin: 0 0 16px 0;
  page-break-after: avoid;
}
h2 {
  font-size: 15pt;
  font-weight: bold;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 4px;
  margin: 24px 0 12px 0;
  page-break-after: avoid;
}
h3 {
  font-size: 13pt;
  font-weight: bold;
  color: #374151;
  margin: 18px 0 8px 0;
  page-break-after: avoid;
}
h4 {
  font-size: 11pt;
  font-weight: bold;
  margin: 14px 0 6px 0;
  page-break-after: avoid;
}
p { margin: 0 0 12px 0; }
ul, ol { padding-left: 20px; margin: 0 0 12px 0; }
li { margin-bottom: 4px; }
code {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 3px;
  padding: 1px 5px;
  font-size: 10pt;
  font-family: monospace;
}
pre {
  background: #1e293b;
  border-radius: 5px;
  padding: 12px 14px;
  margin: 0 0 14px 0;
  page-break-inside: avoid;
}
pre code {
  background: none;
  border: none;
  padding: 0;
  color: #e2e8f0;
  font-size: 9.5pt;
  line-height: 1.6;
}
blockquote {
  border-left: 4px solid #6366f1;
  background: #f5f3ff;
  padding: 8px 14px;
  margin: 0 0 14px 0;
  color: #4b5563;
  page-break-inside: avoid;
}
blockquote p { margin: 0; }
table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 14px 0;
  page-break-inside: avoid;
  font-size: 10pt;
}
th {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 6px 10px;
  font-weight: bold;
  text-align: left;
}
td {
  border: 1px solid #e2e8f0;
  padding: 5px 10px;
}
tr:nth-child(even) td { background: #f8fafc; }
hr { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
a  { color: #6366f1; }
strong { font-weight: bold; }
em { font-style: italic; }
img { max-width: 100%; page-break-inside: avoid; }
</style>
</head>
<body>
{!! $content !!}
</body>
</html>