<?php

use App\Livewire\Blade\PdfSample;
use Illuminate\Support\Facades\Route;

Route::prefix('blade')->name('blade.')->group(function () {
    Route::get('/pdf-sample', PdfSample::class)->name('pdf-sample');
});
