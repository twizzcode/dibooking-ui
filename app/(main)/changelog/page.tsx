import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const changelogData = [
  {
    version: "0.1.0",
    date: "11 Januari 2026",
    type: "initial",
    changes: [
      "🎉 Rilis awal Dibooking.id",
      "✨ Fitur booking produk dan jasa",
      "👥 Sistem autentikasi pengguna",
      "🏢 Dashboard untuk provider",
      "📅 Kalender untuk manajemen booking",
      "🔍 Halaman explore untuk mencari produk/jasa",
      "💳 Sistem pembayaran",
    ],
  },
]

const typeColors = {
  initial: "bg-blue-500",
  feature: "bg-green-500",
  improvement: "bg-yellow-500",
  bugfix: "bg-red-500",
}

const typeLabels = {
  initial: "Rilis Awal",
  feature: "Fitur Baru",
  improvement: "Perbaikan",
  bugfix: "Bug Fix",
}

export default function ChangelogPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Changelog</h1>
        <p className="text-muted-foreground">
          Riwayat perubahan dan update terbaru dari Dibooking.id
        </p>
      </div>

      <div className="space-y-8">
        {changelogData.map((changelog) => (
          <Card key={changelog.version}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl">v{changelog.version}</CardTitle>
                <Badge className={typeColors[changelog.type as keyof typeof typeColors]}>
                  {typeLabels[changelog.type as keyof typeof typeLabels]}
                </Badge>
              </div>
              <CardDescription>{changelog.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {changelog.changes.map((change, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
