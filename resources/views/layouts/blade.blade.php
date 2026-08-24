<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $title ?? 'Blade' }} - laravel-orion</title>
        @vite(['resources/css/blade.css', 'resources/js/blade.js'])
        @livewireStyles
    </head>
    <body>
        <nav class="navbar navbar-expand navbar-dark bg-dark mb-4">
            <div class="container">
                <span class="navbar-brand">laravel-orion blade</span>
            </div>
        </nav>

        <div class="container">
            {{ $slot }}
        </div>

        @livewireScripts
    </body>
</html>