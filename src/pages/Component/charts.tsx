import { ApiCataPie, NavTreeChartCard, WeatherLineChart } from "@/components/charts"
export default function ChartsPage() {
    return (
        <div className="flex flex-col space-y-2">

            <WeatherLineChart />
            <div className="grid grid-cols-2 gap-5">
                <ApiCataPie />
                <NavTreeChartCard />
            </div>
        </div>
    )
}