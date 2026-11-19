param(
    [int]$Port = 8080,
    [string]$Root = $PSScriptRoot
)

if (-not $Root) {
    $Root = (Get-Location).Path
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host "Falha ao iniciar na porta $Port, tentando 8000..." -ForegroundColor Yellow
    $Port = 8000
    $prefix = "http://localhost:$Port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Servidor Local Ativo - Site CIDHA (UFPA / MJSAL)        " -ForegroundColor Cyan
Write-Host "  Acesse no navegador: $prefix" -ForegroundColor White
Write-Host "  Pasta Raiz: $Root" -ForegroundColor Gray
Write-Host "  Pressione Ctrl+C para encerrar o servidor.              " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".webp" = "image/webp"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".pdf"  = "application/pdf"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.RawUrl.Split('?')[0]
        $decodedUrl = [System.Uri]::UnescapeDataString($rawUrl)
        
        if ($decodedUrl -eq "/" -or $decodedUrl -eq "") {
            $decodedUrl = "/index.html"
        }

        $relativePath = $decodedUrl.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $filePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($Root, $relativePath))

        # Security check: prevent directory traversal
        if (-not $filePath.StartsWith($Root, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("403 Proibido")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }

        if (Test-Path $filePath -PathType Container) {
            $filePath = [System.IO.Path]::Combine($filePath, "index.html")
        }

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $mime = $mimeTypes[$ext]
            }

            $response.ContentType = $mime
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Cache-Control", "no-cache")

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length

            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            $response.StatusCode = 200
            Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] 200 OK: $decodedUrl ($($bytes.Length) bytes)" -ForegroundColor DarkGreen
        } else {
            $response.StatusCode = 404
            $html404 = "<html><head><meta charset='utf-8'><title>404 Não Encontrado</title></head><body style='font-family:sans-serif;text-align:center;padding:50px;'><h2>404 - Arquivo não encontrado</h2><p>O arquivo solicitado <code>$decodedUrl</code> não existe.</p><a href='/'>Voltar para a página inicial</a></body></html>"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($html404)
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] 404 Not Found: $decodedUrl" -ForegroundColor Red
        }

        $response.Close()
    } catch {
        if (-not $listener.IsListening) { break }
        Write-Host "Erro na requisição: $_" -ForegroundColor Yellow
    }
}
