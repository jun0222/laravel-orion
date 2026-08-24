<div class="row justify-content-center">
    <div class="col-md-6">
        <div class="card">
            <div class="card-body">
                <h1 class="h4 card-title mb-3">mPDF サンプル</h1>
                <p class="text-muted">タイトルを入力してPDFを生成します。</p>

                <div class="mb-3">
                    <label for="title" class="form-label">タイトル</label>
                    <input type="text" id="title" class="form-control" wire:model="title">
                    @error('title')
                        <div class="text-danger small mt-1">{{ $message }}</div>
                    @enderror
                </div>

                <button type="button" class="btn btn-primary" wire:click="download">
                    PDFを生成
                </button>
            </div>
        </div>
    </div>
</div>
