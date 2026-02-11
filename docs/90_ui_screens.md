# Splash Screen
<!DOCTYPE html>
<html class="dark" lang="ja"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Sentient - オンボーディング</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;family=Noto+Sans+JP:wght@300;400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#32FF7E", // Bright Neon Green
                        "bg-dark": "#0A1F14", // Deep Dark Green
                        "surface": "#122B1D", // Slightly lighter green
                    },
                    fontFamily: {
                        "sans": ["Inter", "Noto Sans JP", "sans-serif"]
                    },
                },
            },
        }
    </script>
<style type="text/tailwindcss">
        :root {
            --primary: #32FF7E;
            --bg-dark: #0A1F14;
        }
        body {
            background-color: var(--bg-dark);
            -webkit-tap-highlight-color: transparent;
            overflow: hidden;
        }
        .neon-glow {
            box-shadow: 0 0 30px rgba(50, 255, 126, 0.3);
        }
        .glass-card {
            background: rgba(18, 43, 29, 0.4);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(50, 255, 126, 0.1);
        }
        .step-indicator {
            @apply w-1.5 h-1.5 rounded-full transition-all duration-300;
        }
        .step-active {
            @apply w-6 bg-primary;
        }
        .step-inactive {
            @apply bg-white/20;
        }
        .illustration-container {
            position: relative;
            width: 280px;
            height: 280px;
        }
        .voice-wave {
            position: absolute;
            border: 2px solid var(--primary);
            border-radius: 50%;
            opacity: 0.3;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="text-slate-100 font-sans">
<div class="fixed top-0 w-full h-12 flex justify-between items-center px-8 z-50">
<div class="text-sm font-medium">9:41</div>
<div class="flex items-center space-x-1.5">
<span class="material-icons text-[16px]">signal_cellular_alt</span>
<span class="material-icons text-[16px]">wifi</span>
<span class="material-icons text-[16px]">battery_full</span>
</div>
</div>
<div class="fixed top-14 right-6 z-50">
<button class="text-sm font-medium text-white/40 px-4 py-2">スキップ</button>
</div>
<main class="relative h-screen flex flex-col items-center justify-between pt-28 pb-16 px-8 overflow-hidden">
<div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
<div class="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
<div class="illustration-container flex items-center justify-center">
<div class="relative w-full h-full flex items-center justify-center">
<div class="absolute w-48 h-48 bg-primary/10 rounded-full animate-pulse"></div>
<div class="absolute w-64 h-64 border border-primary/20 rounded-full"></div>
<div class="relative z-20 flex flex-col items-center">
<span class="material-symbols-outlined text-primary text-[120px] font-light">record_voice_over</span>
</div>
<div class="absolute top-10 right-10 w-4 h-4 bg-primary rounded-full blur-[2px]"></div>
<div class="absolute bottom-12 left-12 w-2 h-2 bg-primary/60 rounded-full"></div>
</div>
</div>
</div>
<div class="relative z-10 w-full text-center space-y-6 mt-8">
<div class="space-y-3">
<span class="text-xs font-bold text-primary uppercase tracking-[0.3em]">Step 01</span>
<h2 class="text-2xl font-bold text-white leading-tight">あなたの声を登録</h2>
<p class="text-white/60 text-[15px] leading-relaxed max-w-[280px] mx-auto">
                    AIがあなたの声を学習し、<br/>会話の中からあなたを識別します。
                </p>
</div>
<div class="flex justify-center items-center space-x-2 py-4">
<div class="step-indicator step-active"></div>
<div class="step-indicator step-inactive"></div>
<div class="step-indicator step-inactive"></div>
</div>
</div>
<footer class="relative z-10 w-full flex flex-col items-center space-y-8">
<button class="w-full bg-primary text-bg-dark font-bold py-5 rounded-2xl neon-glow flex items-center justify-center space-x-2 active:scale-[0.98] transition-all">
<span class="text-lg">次へ</span>
<span class="material-icons">arrow_forward</span>
</button>
<div class="w-32 h-1.5 bg-white/10 rounded-full"></div>
</footer>
</main>
<div class="absolute bottom-0 left-0 w-full h-[20%] opacity-20 pointer-events-none bg-gradient-to-t from-primary/30 to-transparent"></div>

</body></html>

<!DOCTYPE html>
<html class="dark" lang="ja"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Sentient - オンボーディング</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;family=Noto+Sans+JP:wght@300;400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#32FF7E", // Bright Neon Green
                        "bg-dark": "#0A1F14", // Deep Dark Green
                        "surface": "#122B1D", // Slightly lighter green
                    },
                    fontFamily: {
                        "sans": ["Inter", "Noto Sans JP", "sans-serif"]
                    },
                },
            },
        }
    </script>
<style type="text/tailwindcss">
        :root {
            --primary: #32FF7E;
            --bg-dark: #0A1F14;
        }
        body {
            background-color: var(--bg-dark);
            -webkit-tap-highlight-color: transparent;
            overflow: hidden;
            height: 100dvh;
        }
        .neon-glow {
            box-shadow: 0 0 30px rgba(50, 255, 126, 0.3);
        }
        .illustration-container {
            position: relative;
            width: 100%;
            height: 320px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .step-dot {
            transition: all 0.3s ease;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="text-slate-100 font-sans">
<div class="fixed top-0 w-full h-12 flex justify-between items-center px-8 z-50">
<div class="text-sm font-medium">9:41</div>
<div class="flex items-center space-x-1.5">
<span class="material-icons text-[16px]">signal_cellular_alt</span>
<span class="material-icons text-[16px]">wifi</span>
<span class="material-icons text-[16px]">battery_full</span>
</div>
</div>
<main class="relative h-screen flex flex-col items-center justify-between pt-20 pb-12 px-8 overflow-hidden">
<div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
<div class="illustration-container mt-4">
<div class="relative w-40 h-80 bg-surface border-4 border-[#1A3827] rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-4 z-20 overflow-hidden">
<div class="absolute top-0 w-1/2 h-6 bg-[#1A3827] rounded-b-2xl"></div>
<div class="w-full aspect-square bg-white rounded-xl flex items-center justify-center p-2 mb-4">
<span class="material-symbols-outlined text-bg-dark text-7xl">qr_code_2</span>
</div>
<div class="w-16 h-1.5 bg-primary/20 rounded-full mb-2"></div>
<div class="w-12 h-1.5 bg-primary/20 rounded-full"></div>
</div>
<div class="absolute inset-0 z-10">
<div class="absolute top-8 left-4 w-16 h-16 rounded-full bg-surface border border-primary/20 flex items-center justify-center">
<span class="material-symbols-outlined text-primary/60 text-3xl">person</span>
</div>
<div class="absolute top-12 right-2 w-14 h-14 rounded-full bg-surface border border-primary/20 flex items-center justify-center">
<span class="material-symbols-outlined text-primary/60 text-2xl">person</span>
</div>
<div class="absolute bottom-10 left-0 w-12 h-12 rounded-full bg-surface border border-primary/20 flex items-center justify-center">
<span class="material-symbols-outlined text-primary/60 text-xl">person</span>
</div>
<div class="absolute bottom-16 right-4 w-18 h-18 rounded-full bg-surface border border-primary/20 flex items-center justify-center">
<span class="material-symbols-outlined text-primary/60 text-3xl">person</span>
</div>
<svg class="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 320 320">
<line stroke="var(--primary)" stroke-dasharray="4 4" stroke-width="1" x1="160" x2="60" y1="160" y2="60"></line>
<line stroke="var(--primary)" stroke-dasharray="4 4" stroke-width="1" x1="160" x2="260" y1="160" y2="80"></line>
<line stroke="var(--primary)" stroke-dasharray="4 4" stroke-width="1" x1="160" x2="50" y1="160" y2="250"></line>
<line stroke="var(--primary)" stroke-dasharray="4 4" stroke-width="1" x1="160" x2="260" y1="160" y2="240"></line>
</svg>
</div>
</div>
<div class="w-full flex flex-col items-center text-center space-y-6 relative z-10 px-2">
<div class="space-y-3">
<span class="text-primary text-xs font-bold tracking-[0.3em] uppercase">Step 02</span>
<h2 class="text-2xl font-bold text-white">メンバーを招待</h2>
<p class="text-slate-400 text-sm leading-relaxed px-4">
                    QRコードで閲覧メンバーを招待し、<br/>会話の分析を開始します。
                </p>
</div>
<div class="flex space-x-2 py-4">
<div class="w-2 h-2 rounded-full bg-primary/20"></div>
<div class="w-6 h-2 rounded-full bg-primary neon-glow"></div>
<div class="w-2 h-2 rounded-full bg-primary/20"></div>
</div>
</div>
<footer class="w-full max-w-xs relative z-10">
<button class="w-full py-4 bg-primary text-bg-dark font-bold rounded-2xl flex items-center justify-center space-x-2 active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
<span class="text-lg">次へ</span>
<span class="material-icons">arrow_forward</span>
</button>
<div class="w-32 h-1.5 bg-white/10 rounded-full mx-auto mt-8"></div>
</footer>
</main>
<div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

</body></html>

<!DOCTYPE html>
<html class="dark" lang="ja"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Sentient - オンボーディング 3</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;family=Noto+Sans+JP:wght@300;400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#32FF7E", // Bright Neon Green
                        "bg-dark": "#0A1F14", // Deep Dark Green
                        "surface": "#122B1D", // Slightly lighter green
                    },
                    fontFamily: {
                        "sans": ["Inter", "Noto Sans JP", "sans-serif"]
                    },
                },
            },
        }
    </script>
<style type="text/tailwindcss">
        :root {
            --primary: #32FF7E;
            --bg-dark: #0A1F14;
        }
        body {
            background-color: var(--bg-dark);
            -webkit-tap-highlight-color: transparent;
            overflow: hidden;
            min-height: max(844px, 100dvh);
        }
        .neon-glow {
            box-shadow: 0 0 30px rgba(50, 255, 126, 0.3);
        }
        .glass-card {
            background: rgba(18, 43, 29, 0.4);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(50, 255, 126, 0.1);
        }
        .waveform-bar {
            @apply bg-primary rounded-full;
            width: 3px;
            animation: pulse-height 2s ease-in-out infinite;
        }
        @keyframes pulse-height {
            0%, 100% { height: 10px; opacity: 0.3; }
            50% { height: 30px; opacity: 1; }
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="text-slate-100 font-sans">
<div class="fixed top-0 w-full h-12 flex justify-between items-center px-8 z-50">
<div class="text-sm font-medium">9:41</div>
<div class="flex items-center space-x-1.5">
<span class="material-icons text-[16px]">signal_cellular_alt</span>
<span class="material-icons text-[16px]">wifi</span>
<span class="material-icons text-[16px]">battery_full</span>
</div>
</div>
<main class="relative h-screen flex flex-col items-center justify-between pt-20 pb-16 px-8 overflow-hidden">
<div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
<div class="relative w-full aspect-square max-w-[320px] flex items-center justify-center">
<div class="relative w-full h-full flex items-center justify-center">
<div class="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center z-20">
<span class="material-symbols-outlined text-primary text-3xl">psychology</span>
</div>
<div class="absolute top-10 left-10 w-12 h-12 rounded-full glass-card flex items-center justify-center">
<span class="material-icons text-white/40">person</span>
</div>
<div class="absolute top-10 right-10 w-12 h-12 rounded-full glass-card flex items-center justify-center">
<span class="material-icons text-white/40">person</span>
</div>
<div class="absolute bottom-10 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full glass-card flex items-center justify-center border-primary/20">
<span class="material-icons text-primary/60">person</span>
</div>
<svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 320">
<path d="M70,80 L140,140" fill="none" stroke="rgba(50, 255, 126, 0.4)" stroke-dasharray="4 4" stroke-width="2"></path>
<path d="M250,80 L180,140" fill="none" stroke="rgba(50, 255, 126, 0.4)" stroke-dasharray="4 4" stroke-width="2"></path>
<path d="M160,240 L160,180" fill="none" marker-end="url(#arrowhead)" stroke="#32FF7E" stroke-width="2"></path>
<defs>
<marker id="arrowhead" markerHeight="7" markerWidth="10" orient="auto" refX="0" refY="3.5">
<polygon fill="#32FF7E" points="0 0, 10 3.5, 0 7"></polygon>
</marker>
</defs>
</svg>
<div class="absolute top-1/2 -translate-y-1/2 right-0 glass-card p-2 rounded-lg text-[10px] space-y-1 animate-bounce" style="animation-duration: 4s;">
<div class="flex items-center space-x-1">
<div class="w-1.5 h-1.5 rounded-full bg-primary"></div>
<span class="text-primary/90">Positive 82%</span>
</div>
</div>
<div class="absolute bottom-4 right-8 glass-card px-3 py-2 rounded-xl flex items-end space-x-1 h-12">
<div class="waveform-bar" style="animation-delay: 0.1s"></div>
<div class="waveform-bar" style="animation-delay: 0.3s"></div>
<div class="waveform-bar" style="animation-delay: 0.2s"></div>
<div class="waveform-bar" style="animation-delay: 0.5s"></div>
<div class="waveform-bar" style="animation-delay: 0.4s"></div>
</div>
</div>
</div>
<div class="w-full text-center space-y-4 relative z-10 px-2">
<h2 class="text-2xl font-bold text-white leading-tight">手順 3<br/>インサイトを閲覧</h2>
<p class="text-sm text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                誰が誰に対して、どのような感情的傾向を持っているかをリアルタイムで確認できます。
            </p>
</div>
<footer class="w-full flex flex-col items-center space-y-8 relative z-10">
<div class="flex space-x-2">
<div class="w-2 h-2 rounded-full bg-primary/20"></div>
<div class="w-2 h-2 rounded-full bg-primary/20"></div>
<div class="w-6 h-2 rounded-full bg-primary"></div>
</div>
<button class="w-full py-4 bg-primary text-bg-dark font-bold text-lg rounded-2xl neon-glow active:scale-[0.98] transition-all flex items-center justify-center space-x-2">
<span>はじめる</span>
<span class="material-icons">arrow_forward</span>
</button>
<div class="w-32 h-1.5 bg-white/10 rounded-full mt-4"></div>
</footer>
</main>
<div class="absolute bottom-0 left-0 w-full h-[40%] opacity-20 pointer-events-none bg-gradient-to-t from-primary/30 to-transparent"></div>

</body></html>

# 初回画面
<!DOCTYPE html>
<html class="dark" lang="ja"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ホストプロフィール・音声登録 - Emotion Insight</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#2bee6c",
                        "background-dark": "#0d1310",
                        "card-dark": "#161d1a",
                    },
                    fontFamily: {
                        "display": ["Inter", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "1rem",
                        "2xl": "1.5rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
<style type="text/tailwindcss">
        :root {
            --ios-bg: #0d1310;
            --accent-green: #2bee6c;
        }
        body {
            min-height: 100dvh;
            -webkit-font-smoothing: antialiased;
        }
        .ios-blur {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
        .waveform-bar {
            @apply bg-primary/20 rounded-full transition-all duration-300;
            width: 4px;
        }
        .waveform-bar-active {
            @apply bg-primary;
        }
        .ios-input {
            @apply w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all;
        }
    </style>
<style>
        body {
            min-height: max(884px, 100dvh);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="font-display bg-background-dark text-slate-100 flex justify-center">
<div class="w-full max-w-md bg-background-dark min-h-screen flex flex-col relative overflow-hidden">
<div class="absolute top-0 left-0 right-0 h-96 pointer-events-none overflow-hidden z-0">
<div class="absolute -top-32 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
<div class="absolute top-20 -right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]"></div>
</div>
<header class="relative z-10 pt-16 px-6 pb-4 text-center">
<h1 class="text-2xl font-light text-white mb-1 tracking-tight">ホストプロフィール登録</h1>
<p class="text-[12px] text-slate-400">分析を開始するための基本情報を設定します</p>
</header>
<main class="flex-1 px-6 space-y-8 relative z-10">
<section class="flex flex-col items-center py-4">
<div class="relative group">
<div class="w-28 h-28 rounded-full bg-card-dark border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden">
<span class="material-symbols-outlined text-4xl text-white/20">person</span>
</div>
<button class="absolute bottom-0 right-0 w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
<span class="material-symbols-outlined text-background-dark text-xl">photo_camera</span>
</button>
</div>
<p class="text-[10px] text-slate-500 mt-3 font-medium uppercase tracking-widest">アイコンを設定</p>
</section>
<section class="space-y-3">
<label class="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-1">
                    表示名
                </label>
<div class="relative">
<input class="ios-input" placeholder="例：田中 太郎" type="text" value=""/>
<div class="absolute right-4 top-1/2 -translate-y-1/2">
<span class="material-symbols-outlined text-slate-500 text-lg">edit</span>
</div>
</div>
<p class="text-[10px] text-slate-500 px-1 leading-relaxed">
                    ※この名前は他の参加者（オブザーバー）に表示されます。
                </p>
</section>
<section class="space-y-4">
<div class="flex items-center justify-between px-1">
<label class="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                        音声登録
                    </label>
<span class="text-[10px] font-medium text-primary">話者識別の精度向上</span>
</div>
<div class="bg-card-dark/60 border border-white/5 p-6 rounded-2xl shadow-xl">
<div class="text-center mb-6">
<p class="text-sm font-medium text-slate-200 mb-1">「数秒間お話しください」</p>
<p class="text-[11px] text-slate-400">あなたの声をアプリが学習し、会話中の発話を特定します</p>
</div>
<div class="flex items-center justify-center gap-1.5 h-12 mb-8">
<div class="waveform-bar h-4"></div>
<div class="waveform-bar h-8"></div>
<div class="waveform-bar h-12"></div>
<div class="waveform-bar h-10 waveform-bar-active"></div>
<div class="waveform-bar h-14 waveform-bar-active"></div>
<div class="waveform-bar h-12 waveform-bar-active"></div>
<div class="waveform-bar h-8"></div>
<div class="waveform-bar h-6"></div>
<div class="waveform-bar h-4"></div>
<div class="waveform-bar h-8"></div>
<div class="waveform-bar h-12"></div>
<div class="waveform-bar h-6"></div>
</div>
<div class="flex justify-center">
<button class="relative w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group active:scale-95 transition-transform">
<div class="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse"></div>
<div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(43,238,108,0.3)]">
<span class="material-symbols-outlined text-background-dark text-3xl">mic</span>
</div>
</button>
</div>
</div>
</section>
<div class="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl flex gap-3">
<span class="material-symbols-outlined text-primary text-xl">verified_user</span>
<p class="text-[11px] text-slate-400 leading-relaxed">
                    音声データはデバイス内での識別にのみ利用され、会話の内容そのものがサーバーに保存されることはありません。
                </p>
</div>
</main>
<footer class="relative z-10 px-6 pt-6 pb-12 bg-gradient-to-t from-background-dark via-background-dark to-transparent">
<button class="w-full bg-primary py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(43,238,108,0.2)] active:opacity-90 transition-opacity">
<span class="text-background-dark font-bold tracking-wider">設定を完了して開始</span>
<span class="material-symbols-outlined text-background-dark">arrow_forward_ios</span>
</button>
</footer>
<div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-40"></div>
</div>

</body></html>

# home screen
<!DOCTYPE html>
<html class="dark" lang="ja"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Sentient - ホーム画面</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;family=Noto+Sans+JP:wght@300;400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#32FF7E", // Bright Neon Green
                        "bg-dark": "#0A1F14", // Deep Dark Green
                        "surface": "#122B1D", // Slightly lighter green for cards
                    },
                    fontFamily: {
                        "sans": ["Inter", "Noto Sans JP", "sans-serif"]
                    },
                },
            },
        }
    </script>
<style type="text/tailwindcss">
        :root {
            --primary: #32FF7E;
            --bg-dark: #0A1F14;
        }
        body {
            background-color: var(--bg-dark);
            -webkit-tap-highlight-color: transparent;
            overflow: hidden;
        }
        .neon-glow {
            box-shadow: 0 0 40px rgba(50, 255, 126, 0.4);
        }
        .glass-dark {
            background: rgba(18, 43, 29, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(50, 255, 126, 0.1);
        }
        .circle-ripple {
            border: 1px solid rgba(50, 255, 126, 0.15);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="text-slate-100 font-sans">
<div class="fixed top-0 w-full h-12 flex justify-between items-center px-8 z-50">
<div class="text-sm font-medium">9:41</div>
<div class="flex items-center space-x-1.5">
<span class="material-icons text-[16px]">signal_cellular_alt</span>
<span class="material-icons text-[16px]">wifi</span>
<span class="material-icons text-[16px]">battery_full</span>
</div>
</div>
<div class="fixed top-14 left-6 z-50">
<button class="w-10 h-10 rounded-full flex items-center justify-center text-primary/80">
<span class="material-icons text-2xl">history</span>
</button>
</div>
<div class="fixed top-14 right-6 z-50">
<button class="w-10 h-10 rounded-full flex items-center justify-center text-primary/80">
<span class="material-icons text-2xl">settings</span>
</button>
</div>
<main class="relative h-screen flex flex-col items-center justify-between pt-24 pb-12 px-8 overflow-hidden">
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
<header class="flex flex-col items-center text-center space-y-2 relative z-10">
<div class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
<span class="material-icons text-bg-dark text-3xl">insights</span>
</div>
<h1 class="text-3xl font-bold tracking-tight text-white uppercase">Sentient</h1>
<p class="text-sm text-primary/70 tracking-widest font-light">リアルタイム・ソーシャル・インテリジェンス</p>
</header>
<div class="flex flex-col items-center justify-center relative z-10">
<div class="absolute w-[300px] h-[300px] circle-ripple rounded-full"></div>
<div class="absolute w-[400px] h-[400px] circle-ripple rounded-full opacity-50"></div>
<button class="relative w-48 h-48 bg-primary rounded-full neon-glow flex flex-col items-center justify-center active:scale-95 transition-transform duration-200">
<span class="material-icons text-bg-dark text-6xl mb-1">mic</span>
<span class="text-bg-dark font-bold text-lg tracking-widest">開始</span>
</button>
</div>
<footer class="w-full max-w-xs flex flex-col items-center space-y-8 relative z-10">
<button class="w-full flex items-center justify-center space-x-3 py-4 glass-dark rounded-2xl active:scale-[0.98] transition-all">
<span class="material-icons text-primary">qr_code_scanner</span>
<span class="text-sm font-medium tracking-wide">QRコードで参加</span>
</button>
<div class="flex items-center space-x-2">
<div class="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
<p class="text-[10px] text-primary/40 uppercase tracking-[0.2em] font-medium">Ready to Analyze</p>
</div>
<div class="w-32 h-1 bg-white/10 rounded-full mt-2"></div>
</footer>
</main>
<div class="absolute bottom-0 left-0 w-full h-[30%] opacity-30 pointer-events-none bg-gradient-to-t from-primary/20 to-transparent"></div>

</body></html>

# session lobby screen
<!DOCTYPE html>
<html class="dark" lang="ja"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#20e060",
                        "background-dark": "#0a1a10",
                        "surface-dark": "#122a1c",
                    },
                    fontFamily: {
                        "display": ["Inter", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "1rem",
                        "2xl": "1.5rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
<style type="text/tailwindcss">
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .ios-blur {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
        .qr-frame {
            background-color: white;
            padding: 12px;
            border-radius: 12px;
        }
    </style>
<style>
        body {
            min-height: max(884px, 100dvh);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-dark text-slate-100 font-display min-h-screen flex flex-col items-center">
<div class="h-14 w-full bg-background-dark sticky top-0 z-50"></div>
<header class="w-full max-w-md px-6 py-2 flex items-center justify-between sticky top-14 z-50 bg-background-dark/90 ios-blur">
<button class="p-2 -ml-2 text-slate-400">
<span class="material-icons">arrow_back_ios</span>
</button>
<h1 class="text-lg font-bold tracking-tight">セッションロビー</h1>
<button class="p-2 -mr-2 text-slate-400">
<span class="material-icons">settings</span>
</button>
</header>
<main class="w-full max-w-md px-6 flex-1 flex flex-col">
<section class="mt-8 mb-8 flex flex-col items-center">
<div class="relative">
<div class="qr-frame shadow-2xl">
<img alt="QR Code" class="w-44 h-44 sm:w-52 sm:h-52" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh5I7QWdRyJFQavATnLDzmzyrPdeNiNeiQSSuP_wZViwJCJT2g4G6t2qEOb4YD-ErE7y6Xt0TlfDCDDPOXVF2IR0Ks5TmIdzS6Slki5vew7g1zcwXfLZBLzv32TQnK65wbQTV_WcAFrp6rVkb4bJ-nMpUuaJWpc6qvpy04D9tuUYcp-JjNi9lUjVd_V5BCi2GpAExIdv12t6AEgvppQEkFgdJhrBU6_z_e_u45-vsJrDYCTKSsFIttb0hJJ5ylD9nX7sV0TJ9AiKM"/>
</div>
</div>
<div class="mt-6 text-center">
<p class="text-sm font-medium text-slate-400">QRコードをスキャンして閲覧</p>
<div class="mt-3 flex items-center justify-center space-x-2 bg-white/5 py-2 px-4 rounded-full border border-white/10">
<span class="text-xs font-mono uppercase tracking-widest text-primary">a7b2 - c8d4</span>
<button class="material-symbols-outlined text-sm text-slate-500">content_copy</button>
</div>
</div>
</section>
<section class="flex-1">
<div class="flex items-center justify-between mb-4 px-1">
<h2 class="text-xs font-bold uppercase tracking-widest text-slate-500">閲覧中の分析メンバー</h2>
<div class="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
<span class="relative flex h-1.5 w-1.5">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
</span>
<span class="text-[11px] font-bold text-primary">3名がアクティブ</span>
</div>
</div>
<div class="space-y-3">
<div class="flex items-center justify-between p-4 bg-surface-dark border border-white/5 rounded-2xl">
<div class="flex items-center space-x-3">
<div class="w-11 h-11 rounded-full overflow-hidden bg-slate-800 border border-white/10">
<img alt="User 1" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdQ7GxFZ9zTClshSnah8yzeb9dgXMgOaakjaxgTzDxAXKdFC4Wq9h4lCViIhY8gEsXGoXYluyI6ZfCTcMF9hau0NXj2BFwxWlXXmIKmbt7F1ezBPUQ9Arc-RkKUfgZRu83mcQ_3KI2iphvFHduH9DCSbl5_YTTcIhkh6dDgIV6LMNf5SasS6YBA73tRyl4VBY-8pyYir_c9oSibhRds6pnb4rPVO3ZaJ5mcMDBABlsMruwk_z_1gSBBAPCwb9kHRll39Ips7mF7yo"/>
</div>
<div>
<p class="text-[15px] font-semibold">ホスト (あなた)</p>
<p class="text-[11px] text-primary font-medium">セッション管理者</p>
</div>
</div>
<span class="material-symbols-outlined text-primary text-xl">visibility</span>
</div>
<div class="flex items-center justify-between p-4 bg-surface-dark border border-white/5 rounded-2xl">
<div class="flex items-center space-x-3">
<div class="w-11 h-11 rounded-full overflow-hidden bg-slate-800 border border-white/10">
<img alt="User 2" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO6RllmqGaq6sDBnpC8vXDpbsG4YFF6M3yqMbsS5tjDiX4KnxGw4H0Aqrk8wL0qIhBzTzNN3wIJXKcXB8iEFEo6I8_GFczfkNlV4CxSpGdx0xHluD1j70yTPQxnRKcitnVRhmNmRwtRcwtN9wW2VwW7S1uyxeKFmf5nzhhouSnTDf8IV-0x0ZRqX88xZsohlRHX3OycBjEx6n5xSceys3lkfP1M3ZOiLvf5X1VUE1XJQXjH1N_w_72qrxXKAEzy5-lEM51iEeVHh4"/>
</div>
<div>
<p class="text-[15px] font-semibold">Sarah Jenkins</p>
<p class="text-[11px] text-slate-500 font-medium">オブザーバー</p>
</div>
</div>
<span class="material-symbols-outlined text-primary text-xl">visibility</span>
</div>
<div class="flex items-center justify-between p-4 bg-surface-dark border border-white/5 rounded-2xl">
<div class="flex items-center space-x-3">
<div class="w-11 h-11 rounded-full overflow-hidden bg-slate-800 border border-white/10">
<img alt="User 3" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgpKpIib-Rzi4JJ1fsR2H8zs4JwGuEJRLo6kr2IIL2pgfhOdYSzy1CCf81a8IcVuMCvpjFGzlZcGA06921JPMzDpBUyLMYs2SI9bW436UxiAtYbwrqRHNve0NzUb0GGS1Ne5EM_YYc06422VdwnMc-VOTvL2uf-M3VhC74Mn7DgyF1I9WC__dCjdhmZt1F1wcEUqIaJMQH_wEJVpDfcuC7q6GJQuiVX4Qk21iiWDdF14lX7Odt-qPhPeMRE7fUCu-T3HVZvwlFDxs"/>
</div>
<div>
<p class="text-[15px] font-semibold">Marcus Webb</p>
<p class="text-[11px] text-slate-500 font-medium">オブザーバー</p>
</div>
</div>
<span class="material-symbols-outlined text-primary text-xl">visibility</span>
</div>
<div class="border border-dashed border-white/10 p-5 rounded-2xl flex items-center justify-center bg-white/[0.02]">
<p class="text-xs text-slate-500 font-medium">他の分析メンバーを待機中...</p>
</div>
</div>
</section>
<footer class="mt-8 pb-12 space-y-6">
<div class="flex items-start space-x-3 px-2">
<span class="material-symbols-outlined text-primary mt-0.5 text-lg">info</span>
<p class="text-[12px] leading-relaxed text-slate-400">
                    セッションを開始すると、リアルタイムの感情分析が有効になります。閲覧メンバーはこのセッションの結果をリアルタイムで共有・確認できます。
                </p>
</div>
<button class="w-full bg-primary hover:bg-[#1bc954] text-background-dark font-bold py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center space-x-2 active:scale-[0.98]">
<span class="material-symbols-outlined font-bold">play_arrow</span>
<span class="text-base tracking-wide">分析セッションを開始</span>
</button>
</footer>
</main>
<div class="fixed bottom-1 w-32 h-1 bg-white/20 rounded-full left-1/2 -translate-x-1/2"></div>

</body></html>

# QR読み込んだ際に表示される画面
<!DOCTYPE html>
<html class="dark" lang="ja"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#20e060",
                        "background-dark": "#0a1a10",
                        "surface-dark": "#122a1c",
                    },
                    fontFamily: {
                        "display": ["Inter", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "1rem",
                        "2xl": "1.5rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
<style type="text/tailwindcss">
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .ios-blur {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
        input:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(32, 224, 96, 0.3);
        }
        .waveform-bar {
            @apply bg-primary/40 w-1 rounded-full mx-[1px];
        }
        .waveform-bar-active {
            @apply bg-primary;
        }
    </style>
<style>
        body {
            min-height: 100dvh;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-dark text-slate-100 font-display flex flex-col items-center">
<div class="h-10 w-full bg-background-dark sticky top-0 z-50"></div>
<header class="w-full max-w-md px-6 py-2 flex items-center justify-between sticky top-10 z-50 bg-background-dark/90 ios-blur">
<button class="p-2 -ml-2 text-slate-400">
<span class="material-icons">arrow_back_ios</span>
</button>
<h1 class="text-lg font-bold tracking-tight text-center flex-1 pr-6">閲覧者プロフィール設定</h1>
<div class="w-4"></div>
</header>
<main class="w-full max-w-md px-6 flex-1 flex flex-col pt-4 pb-12 overflow-y-auto">
<section class="flex flex-col items-center mb-8">
<div class="relative group">
<div class="w-28 h-28 rounded-full bg-surface-dark border-4 border-primary flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/10">
<img alt="Default Avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdQ7GxFZ9zTClshSnah8yzeb9dgXMgOaakjaxgTzDxAXKdFC4Wq9h4lCViIhY8gEsXGoXYluyI6ZfCTcMF9hau0NXj2BFwxWlXXmIKmbt7F1ezBPUQ9Arc-RkKUfgZRu83mcQ_3KI2iphvFHduH9DCSbl5_YTTcIhkh6dDgIV6LMNf5SasS6YBA73tRyl4VBY-8pyYir_c9oSibhRds6pnb4rPVO3ZaJ5mcMDBABlsMruwk_z_1gSBBAPCwb9kHRll39Ips7mF7yo"/>
</div>
<button class="absolute bottom-0 right-0 bg-primary text-background-dark w-9 h-9 rounded-full flex items-center justify-center shadow-lg">
<span class="material-symbols-outlined font-bold text-xl">photo_camera</span>
</button>
</div>
<p class="mt-4 text-xs text-slate-400 font-medium">プロフィール画像を選択</p>
<div class="flex space-x-4 mt-4">
<div class="w-11 h-11 rounded-full border-2 border-primary bg-surface-dark overflow-hidden scale-110">
<img alt="Avatar 1" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdQ7GxFZ9zTClshSnah8yzeb9dgXMgOaakjaxgTzDxAXKdFC4Wq9h4lCViIhY8gEsXGoXYluyI6ZfCTcMF9hau0NXj2BFwxWlXXmIKmbt7F1ezBPUQ9Arc-RkKUfgZRu83mcQ_3KI2iphvFHduH9DCSbl5_YTTcIhkh6dDgIV6LMNf5SasS6YBA73tRyl4VBY-8pyYir_c9oSibhRds6pnb4rPVO3ZaJ5mcMDBABlsMruwk_z_1gSBBAPCwb9kHRll39Ips7mF7yo"/>
</div>
<div class="w-11 h-11 rounded-full border-2 border-white/10 bg-surface-dark overflow-hidden opacity-40">
<img alt="Avatar 2" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO6RllmqGaq6sDBnpC8vXDpbsG4YFF6M3yqMbsS5tjDiX4KnxGw4H0Aqrk8wL0qIhBzTzNN3wIJXKcXB8iEFEo6I8_GFczfkNlV4CxSpGdx0xHluD1j70yTPQxnRKcitnVRhmNmRwtRcwtN9wW2VwW7S1uyxeKFmf5nzhhouSnTDf8IV-0x0ZRqX88xZsohlRHX3OycBjEx6n5xSceys3lkfP1M3ZOiLvf5X1VUE1XJQXjH1N_w_72qrxXKAEzy5-lEM51iEeVHh4"/>
</div>
<div class="w-11 h-11 rounded-full border-2 border-white/10 bg-surface-dark overflow-hidden opacity-40">
<img alt="Avatar 3" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgpKpIib-Rzi4JJ1fsR2H8zs4JwGuEJRLo6kr2IIL2pgfhOdYSzy1CCf81a8IcVuMCvpjFGzlZcGA06921JPMzDpBUyLMYs2SI9bW436UxiAtYbwrqRHNve0NzUb0GGS1Ne5EM_YYc06422VdwnMc-VOTvL2uf-M3VhC74Mn7DgyF1I9WC__dCjdhmZt1F1wcEUqIaJMQH_wEJVpDfcuC7q6GJQuiVX4Qk21iiWDdF14lX7Odt-qPhPeMRE7fUCu-T3HVZvwlFDxs"/>
</div>
</div>
</section>
<section class="space-y-6 mb-8">
<div class="space-y-2">
<label class="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">ユーザー名</label>
<input class="w-full bg-surface-dark border-white/10 rounded-2xl py-4 px-5 text-base text-slate-100 placeholder:text-slate-600 transition-all focus:border-primary/50" placeholder="名前を入力してください" type="text" value="Guest User"/>
</div>
</section>
<section class="space-y-4 mb-10">
<div class="flex items-center justify-between ml-1">
<label class="text-[11px] font-bold uppercase tracking-widest text-slate-500">音声登録</label>
<span class="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">推奨</span>
</div>
<div class="bg-surface-dark/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
<div class="space-y-1">
<p class="text-sm font-bold text-slate-200">数秒間お話しください</p>
<p class="text-[11px] text-slate-500">あなたの声を認識し、会話の分析精度を高めます</p>
</div>
<div class="flex items-end justify-center h-12 space-x-0.5 w-full max-w-[200px]">
<div class="waveform-bar h-4"></div>
<div class="waveform-bar h-6"></div>
<div class="waveform-bar h-3"></div>
<div class="waveform-bar h-8"></div>
<div class="waveform-bar h-10"></div>
<div class="waveform-bar h-5"></div>
<div class="waveform-bar h-12 waveform-bar-active"></div>
<div class="waveform-bar h-7"></div>
<div class="waveform-bar h-9"></div>
<div class="waveform-bar h-4"></div>
<div class="waveform-bar h-6"></div>
<div class="waveform-bar h-3"></div>
<div class="waveform-bar h-8"></div>
<div class="waveform-bar h-5"></div>
<div class="waveform-bar h-4"></div>
</div>
<button class="w-16 h-16 rounded-full bg-background-dark border-2 border-primary/30 flex items-center justify-center group active:scale-95 transition-transform">
<div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-3xl fill-1">mic</span>
</div>
</button>
<p class="text-[10px] font-bold text-primary animate-pulse">録音ボタンを押して開始</p>
</div>
</section>
<section class="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-start space-x-3 mb-8">
<span class="material-symbols-outlined text-primary text-xl">info</span>
<div class="space-y-1">
<p class="text-[12px] font-bold text-primary">閲覧モード（オブザーバー）</p>
<p class="text-[11px] leading-relaxed text-slate-400">
                    あなたは閲覧者としてセッションに参加します。登録した音声は、話者識別のみに使用され、外部に公開されることはありません。
                </p>
</div>
</section>
<footer class="mt-auto pt-4">
<button class="w-full bg-primary hover:bg-[#1bc954] text-background-dark font-bold py-4 rounded-2xl transition-all shadow-xl shadow-primary/30 flex items-center justify-center space-x-2 active:scale-[0.98]">
<span class="text-base tracking-wide">プロフィールを登録して参加</span>
<span class="material-symbols-outlined font-bold">chevron_right</span>
</button>
<p class="text-center text-[10px] text-slate-500 mt-4 px-6 leading-tight">
                「参加する」をタップすることで、プライバシーポリシーに同意したものとみなされます
            </p>
</footer>
</main>
<div class="fixed bottom-1 w-32 h-1 bg-white/20 rounded-full left-1/2 -translate-x-1/2"></div>

</body></html>

# 分析開始ボタンを押下した際に表示される画面
<!DOCTYPE html>
<html class="dark" lang="ja"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>セッション録音中</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "primary": "#2bee6c",
                "background-dark": "#0a1a10", // 深みのあるダークグリーン
                "surface-dark": "#12261a",
              },
              fontFamily: {
                "display": ["Inter", "sans-serif"]
              },
            },
          },
        }
    </script>
<style type="text/tailwindcss">
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            background-color: #0a1a10;
        }
        .waveform-bar {
            @apply w-1.5 rounded-full;
        }
        .ios-blur {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="text-slate-100 min-h-screen flex flex-col font-display overflow-hidden">
<header class="pt-14 pb-4 px-6 flex justify-between items-center z-10">
<button class="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
<span class="material-icons text-xl">close</span>
</button>
<div class="flex flex-col items-center">
<span class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 mb-0.5">Live Analysis</span>
<div class="flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(43,238,108,0.6)]"></span>
<h1 class="text-xs font-semibold tracking-wide text-white/90">録音セッション中</h1>
</div>
</div>
<button class="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
<span class="material-icons text-xl text-white/80">more_horiz</span>
</button>
</header>
<main class="flex-1 flex flex-col items-center justify-center px-6 relative">
<div class="mb-14">
<div class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 ios-blur">
<span class="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
<span class="text-sm font-semibold text-primary tracking-wide">高いエンゲージメント</span>
</div>
</div>
<div class="relative w-full flex items-center justify-center h-48">
<div class="absolute w-48 h-48 bg-primary/10 rounded-full blur-[60px]"></div>
<div class="absolute w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] translate-x-10"></div>
<div class="absolute w-40 h-40 bg-purple-500/10 rounded-full blur-[60px] -translate-x-10"></div>
<div class="flex items-center justify-center gap-[6px] h-full">
<div class="waveform-bar h-8 bg-primary/20"></div>
<div class="waveform-bar h-14 bg-primary/40"></div>
<div class="waveform-bar h-24 bg-primary/60"></div>
<div class="waveform-bar h-36 bg-primary shadow-[0_0_15px_rgba(43,238,108,0.4)]"></div>
<div class="waveform-bar h-48 bg-primary"></div>
<div class="waveform-bar h-32 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.4)]"></div>
<div class="waveform-bar h-44 bg-blue-500"></div>
<div class="waveform-bar h-28 bg-purple-400/80 shadow-[0_0_15px_rgba(192,132,252,0.4)]"></div>
<div class="waveform-bar h-36 bg-purple-500"></div>
<div class="waveform-bar h-16 bg-primary/40"></div>
<div class="waveform-bar h-10 bg-primary/20"></div>
</div>
</div>
<div class="mt-14 flex flex-col items-center">
<span class="text-6xl font-light tracking-tight tabular-nums text-white mb-3">
                12:45
            </span>
<p class="text-slate-400 text-sm font-medium tracking-wide">会話の流れを分析中...</p>
</div>
<div class="w-full mt-12 grid grid-cols-2 gap-4">
<div class="bg-white/5 border border-white/10 p-4 rounded-2xl ios-blur">
<div class="flex items-center gap-2 mb-1.5">
<span class="material-icons text-blue-400 text-xs">sentiment_satisfied</span>
<span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">トーン</span>
</div>
<div class="text-sm font-bold text-white/90">共感的</div>
</div>
<div class="bg-white/5 border border-white/10 p-4 rounded-2xl ios-blur">
<div class="flex items-center gap-2 mb-1.5">
<span class="material-icons text-primary text-xs">speed</span>
<span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">ペース</span>
</div>
<div class="text-sm font-bold text-white/90">安定した流れ</div>
</div>
</div>
</main>
<footer class="pb-10 pt-6 px-8 flex flex-col items-center gap-8">
<div class="flex items-center justify-center gap-12">
<button class="flex flex-col items-center gap-2.5 group">
<div class="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/5 active:scale-95 transition-transform">
<span class="material-icons text-slate-400 group-active:text-white">mic_off</span>
</div>
<span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">ミュート</span>
</button>
<button class="flex flex-col items-center gap-2.5 group">
<div class="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/5 active:scale-95 transition-transform">
<span class="material-icons text-slate-400 group-active:text-white">bookmark_border</span>
</div>
<span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">タグ付け</span>
</button>
<button class="flex flex-col items-center gap-2.5 group">
<div class="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/5 active:scale-95 transition-transform">
<span class="material-icons text-slate-400 group-active:text-white">equalizer</span>
</div>
<span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">データ表示</span>
</button>
</div>
<button class="w-full max-w-sm bg-primary text-[#0a1a10] py-4.5 h-14 rounded-2xl font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
<span class="material-icons text-2xl">stop_circle</span>
<span class="text-base tracking-wide">セッションを終了して保存</span>
</button>
<div class="h-1.5 w-36 bg-white/10 rounded-full mt-2"></div>
</footer>

</body></html>

# データ表示を押下した際に表示される画面
<!DOCTYPE html>
<html class="dark" lang="ja"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>感情インサイト - Emotion Insight</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#2bee6c",
                        "background-dark": "#0d1310",
                        "card-dark": "#161d1a",
                    },
                    fontFamily: {
                        "display": ["Inter", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "1rem",
                        "2xl": "1.5rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
<style type="text/tailwindcss">
        :root {
            --ios-bg: #0d1310;
            --accent-green: #2bee6c;
        }
        body {
            min-height: 100dvh;
            -webkit-font-smoothing: antialiased;
        }
        .ios-blur {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
        .waveform-bar {
            @apply bg-primary/40 rounded-full;
            width: 3px;
            height: 12px;
        }
        .waveform-bar-active {
            @apply bg-primary animate-pulse;
        }
        .affinity-gradient {
            background: linear-gradient(90deg, rgba(43,238,108,0.15) 0%, rgba(43,238,108,0) 100%);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="font-display bg-background-dark text-slate-100 flex justify-center">
<div class="w-full max-w-md bg-background-dark min-h-screen flex flex-col relative overflow-hidden">
<div class="absolute top-0 left-0 right-0 h-96 pointer-events-none overflow-hidden z-0">
<div class="absolute -top-32 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
<div class="absolute -top-10 -right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]"></div>
</div>
<header class="relative z-10 pt-12 px-6 pb-4 border-b border-white/5 bg-background-dark/40 ios-blur">
<div class="flex items-center justify-between mb-3">
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span class="text-[10px] font-bold tracking-[0.2em] text-primary/80 uppercase">Analysis Live</span>
</div>
<div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
<span class="material-symbols-outlined text-[12px] text-slate-400">visibility</span>
<span class="text-[10px] text-slate-400 font-medium">12 閲覧中</span>
</div>
</div>
<div class="space-y-3">
<div class="flex items-center justify-between">
<h2 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">分析閲覧中（オブザーバー）</h2>
</div>
<div class="flex -space-x-2 overflow-hidden">
<img alt="Observer 1" class="inline-block h-8 w-8 rounded-full ring-2 ring-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDucjugUwfF73ISY6gMC3aEUIVr5D6fX954IKFiIkJVcv4iqMMhaoBNTA5UeUQltfynJz7rNmIMbSkac599aDW_UhZosiRuRW5bnluG_0m1_yqDGOa61xFnBCr46jAEquZ05P7X_JFL7Z0cLEj76e04QddWHY5AKU7P5W8tNFLJKy-TqarINGStkXjUfAxZjFgM4uqmnMFGUc5mAlXYrshepMwBq5AruqL1trH33lCCPMpW2kUoXZ67TzlfIvGbnIaNYkFVXFmjoJ8"/>
<img alt="Observer 2" class="inline-block h-8 w-8 rounded-full ring-2 ring-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGbACHBFZTTUjn-zXO9BPP7uXdzGbgcCJWClLVhcOwkoFa-j8fjEeEUGJiLt-yhiaubC6_O5iwwhlsE7O90LHrH-KHy_TRgWGiiBbnvo2VFStz2O3viM_WiaCpWyymvr86PbtSmk9xWd0e5oW6Ra0X6WmeipsilRTyL5tGVHisyFL8gGSGqpUfpxNPmQThz3QSCG8keWJKbmAqm-2C93B5B3iyLL6mEzY4sCE7ttwZvih0GziVNXMYXhiLOURMxc-ViuxLG8gv9Ns"/>
<img alt="Observer 3" class="inline-block h-8 w-8 rounded-full ring-2 ring-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk9ngZZpvtBADpxwgvY2kvRxEyVF5SIwINgrsThLTdllXzZm958trHvOHIkQ9unQRq77Y-RtMXs_MRqlEknBnLqGZnY2mfrxddN90UkkKDHhRalAspLKeW1fVhQdT1ZMe8A33UOg1IuQPMwAXEqxDyQfHWLfYaINEykxnF0YQOzW4BTp7Zy0-Yk1REjtCY29YKNTfSBQGo7o4lqDa7GW0Xka5xSpAB9SDecYoL-T2GFwsd2vq8ZIkuLeJcjkibVKMv3yjfszUcxHY"/>
<img alt="Observer 4" class="inline-block h-8 w-8 rounded-full ring-2 ring-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl2PYpjcCRo7_tIDO7TtW1xmkQgK8ms1AQ3H46F6Py0PX-yKbwLrU4gKaaH5w4ZcotgVsCGqPEzaIoc22AwH_Q4NTVkcW5K2u4fyrvANtVQS8mu-pElNTTr7Qv2qS4l4vUbW65Asc106amZWMaQyAAH6mvFM5DY2UG7_XpWUL8HDk37XpisTKpkjeTGkKVAECK62346K7NIIhMshpPvlMut2e9s7PcxtRPNDl3sFuHaIg__17_l04EujrFLSaIhePjlsjLdE_suUE"/>
<div class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-card-dark ring-2 ring-background-dark text-[10px] text-slate-500 font-medium">+8</div>
</div>
</div>
</header>
<main class="flex-1 px-5 pt-6 space-y-4 pb-32 overflow-y-auto relative z-10">
<div class="mb-6 flex justify-between items-end">
<div>
<h1 class="text-2xl font-light text-white mb-1">話者インサイト</h1>
<p class="text-xs text-slate-400">検出された話者の感情と関心傾向</p>
</div>
</div>
<div class="bg-card-dark/60 border border-white/5 p-5 rounded-2xl space-y-5 shadow-sm relative overflow-hidden group">
<div class="flex items-start justify-between">
<div class="flex items-center gap-3">
<div class="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center relative">
<span class="text-primary font-bold text-lg">A</span>
<div class="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-card-dark"></div>
</div>
<div>
<h3 class="font-bold text-white tracking-wide">話者 A</h3>
<div class="flex items-center gap-2 mt-0.5">
<div class="flex items-end gap-[2px] h-3">
<div class="waveform-bar waveform-bar-active h-2"></div>
<div class="waveform-bar waveform-bar-active h-3"></div>
<div class="waveform-bar waveform-bar-active h-2.5"></div>
<div class="waveform-bar waveform-bar-active h-1.5"></div>
<div class="waveform-bar waveform-bar-active h-3"></div>
</div>
<span class="text-[10px] text-primary font-bold uppercase tracking-tighter">Speaking</span>
</div>
</div>
</div>
<div class="px-2 py-1 rounded bg-primary/10 border border-primary/20">
<span class="text-[10px] font-bold text-primary">メイン話者</span>
</div>
</div>
<div class="space-y-3 pt-2">
<p class="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px]">volunteer_activism</span>
                    特定の閲覧者への親和的な傾向
                </p>
<div class="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 affinity-gradient">
<div class="relative">
<img alt="Target" class="h-9 w-9 rounded-full ring-2 ring-primary/40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDucjugUwfF73ISY6gMC3aEUIVr5D6fX954IKFiIkJVcv4iqMMhaoBNTA5UeUQltfynJz7rNmIMbSkac599aDW_UhZosiRuRW5bnluG_0m1_yqDGOa61xFnBCr46jAEquZ05P7X_JFL7Z0cLEj76e04QddWHY5AKU7P5W8tNFLJKy-TqarINGStkXjUfAxZjFgM4uqmnMFGUc5mAlXYrshepMwBq5AruqL1trH33lCCPMpW2kUoXZ67TzlfIvGbnIaNYkFVXFmjoJ8"/>
<div class="absolute -top-1 -right-1">
<span class="material-symbols-outlined text-[14px] text-primary bg-background-dark rounded-full">check_circle</span>
</div>
</div>
<div class="flex-1">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-sm">trending_flat</span>
<span class="text-xs font-medium text-slate-200">閲覧者 1 への強い関心</span>
</div>
<p class="text-[11px] text-slate-400 mt-0.5">肯定的・共感的な反応の推定傾向</p>
</div>
</div>
</div>
<div class="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
<div class="space-y-1">
<p class="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">推定感情</p>
<p class="text-xs font-semibold text-primary">高い調和と活性</p>
</div>
<div class="space-y-1">
<p class="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">反応の傾向</p>
<p class="text-xs font-medium text-slate-300">共感的な受容の傾向</p>
</div>
</div>
</div>
<div class="bg-card-dark/60 border border-white/5 p-5 rounded-2xl space-y-5 shadow-sm opacity-90">
<div class="flex items-start justify-between">
<div class="flex items-center gap-3">
<div class="w-12 h-12 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
<span class="text-slate-400 font-bold text-lg">B</span>
</div>
<div>
<h3 class="font-bold text-white tracking-wide">話者 B</h3>
<div class="flex items-center gap-2 mt-0.5">
<div class="flex items-end gap-[2px] h-3">
<div class="waveform-bar h-1"></div>
<div class="waveform-bar h-1"></div>
<div class="waveform-bar h-1"></div>
<div class="waveform-bar h-1"></div>
<div class="waveform-bar h-1"></div>
</div>
<span class="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Silent</span>
</div>
</div>
</div>
<p class="text-[11px] text-slate-500">2分前まで発話</p>
</div>
<div class="space-y-3 pt-2">
<p class="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px]">group</span>
                    全体への関心傾向
                </p>
<div class="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
<div class="flex -space-x-2">
<img alt="Target" class="h-8 w-8 rounded-full border border-card-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGbACHBFZTTUjn-zXO9BPP7uXdzGbgcCJWClLVhcOwkoFa-j8fjEeEUGJiLt-yhiaubC6_O5iwwhlsE7O90LHrH-KHy_TRgWGiiBbnvo2VFStz2O3viM_WiaCpWyymvr86PbtSmk9xWd0e5oW6Ra0X6WmeipsilRTyL5tGVHisyFL8gGSGqpUfpxNPmQThz3QSCG8keWJKbmAqm-2C93B5B3iyLL6mEzY4sCE7ttwZvih0GziVNXMYXhiLOURMxc-ViuxLG8gv9Ns"/>
<img alt="Target" class="h-8 w-8 rounded-full border border-card-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk9ngZZpvtBADpxwgvY2kvRxEyVF5SIwINgrsThLTdllXzZm958trHvOHIkQ9unQRq77Y-RtMXs_MRqlEknBnLqGZnY2mfrxddN90UkkKDHhRalAspLKeW1fVhQdT1ZMe8A33UOg1IuQPMwAXEqxDyQfHWLfYaINEykxnF0YQOzW4BTp7Zy0-Yk1REjtCY29YKNTfSBQGo7o4lqDa7GW0Xka5xSpAB9SDecYoL-T2GFwsd2vq8ZIkuLeJcjkibVKMv3yjfszUcxHY"/>
</div>
<div class="flex-1">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-slate-400 text-sm">trending_flat</span>
<span class="text-xs font-medium text-slate-200">全体への穏やかな関心</span>
</div>
<p class="text-[11px] text-slate-400 mt-0.5">安定した聴取と分析の傾向</p>
</div>
</div>
</div>
<div class="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
<div class="space-y-1">
<p class="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">推定感情</p>
<p class="text-xs font-medium text-slate-300">冷静な安定感</p>
</div>
<div class="space-y-1">
<p class="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">反応の傾向</p>
<p class="text-xs font-medium text-slate-300">論理的な思考傾向</p>
</div>
</div>
</div>
<div class="text-center pt-8 pb-10">
<p class="text-[10px] text-slate-500 px-10 italic leading-relaxed">
                ※これらのインサイトは音声解析に基づく「傾向」と「推定」であり、確定的な評価ではありません。対話の質的な振り返りにご活用ください。
            </p>
</div>
</main>
<div class="absolute bottom-6 left-0 right-0 px-6 z-30">
<nav class="bg-[#1c221e]/90 ios-blur border border-white/10 rounded-full p-2 flex justify-around items-center shadow-2xl">
<button class="flex flex-col items-center py-2 px-6 bg-primary text-background-dark rounded-full transition-all">
<span class="material-symbols-outlined text-xl">insights</span>
<span class="text-[9px] font-bold mt-0.5">インサイト</span>
</button>
<button class="flex flex-col items-center py-2 px-6 text-slate-400">
<span class="material-symbols-outlined text-xl">history</span>
<span class="text-[9px] font-bold mt-0.5">履歴</span>
</button>
<button class="flex flex-col items-center py-2 px-6 text-slate-400">
<span class="material-symbols-outlined text-xl">settings</span>
<span class="text-[9px] font-bold mt-0.5">設定</span>
</button>
</nav>
</div>
<div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-40"></div>
</div>

</body></html>