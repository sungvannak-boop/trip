<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cambodia Tourism Admin Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#F8F7F4] text-[#17211C] min-h-screen">
    <header class="bg-white border-b border-[#E5E0D8] px-8 py-4 flex items-center justify-between">
        <span class="text-xl font-bold text-[#0D5C46]">Kingdom Compass · Admin</span>
        <span class="text-sm text-[#5A655F]">Laravel Blade + Sanctum API</span>
    </header>
    <main class="max-w-6xl mx-auto p-8 space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-2xl border border-[#E5E0D8]">
                <div class="text-xs text-[#5A655F]">Destinations</div>
                <div class="text-3xl font-bold mt-1">{{ $stats['destinations'] ?? 10 }}</div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-[#E5E0D8]">
                <div class="text-xs text-[#5A655F]">Categories</div>
                <div class="text-3xl font-bold mt-1">{{ $stats['categories'] ?? 7 }}</div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-[#E5E0D8]">
                <div class="text-xs text-[#5A655F]">Users</div>
                <div class="text-3xl font-bold mt-1">{{ $stats['users'] ?? 2 }}</div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-[#E5E0D8]">
                <div class="text-xs text-[#5A655F]">Travel Plans</div>
                <div class="text-3xl font-bold mt-1">{{ $stats['trips'] ?? 1 }}</div>
            </div>
        </div>

        <section class="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden">
            <div class="px-6 py-4 border-b border-[#E5E0D8] flex items-center justify-between">
                <h1 class="text-lg font-semibold">Cambodia Destinations Catalog</h1>
                <a href="/api/destinations" class="text-xs font-medium text-[#0D5C46] hover:underline">View JSON Feed</a>
            </div>
            <table class="w-full text-left text-sm">
                <thead class="bg-[#F8F7F4] text-xs text-[#5A655F]">
                    <tr>
                        <th class="py-3 px-6">English Name</th>
                        <th class="py-3 px-6">Khmer Name</th>
                        <th class="py-3 px-6">Province</th>
                        <th class="py-3 px-6">Coordinates</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-[#F0ECE4]">
                    @foreach($destinations ?? [] as $destination)
                    <tr>
                        <td class="py-3 px-6 font-medium">{{ $destination->name_en }}</td>
                        <td class="py-3 px-6">{{ $destination->name_km }}</td>
                        <td class="py-3 px-6">{{ $destination->province_en }}</td>
                        <td class="py-3 px-6 font-mono text-xs">{{ $destination->latitude }}, {{ $destination->longitude }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </section>
    </main>
</body>
</html>
