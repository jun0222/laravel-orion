<?php

use App\Http\Controllers\MarkdownPdfController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Home'));

Route::get('/markdown-pdf',     fn () => Inertia::render('MarkdownToPdf'));
Route::post('/markdown-pdf/convert', [MarkdownPdfController::class, 'convert']);

Route::get('/kyoto', fn () => Inertia::render('KyotoPathfinder'));
