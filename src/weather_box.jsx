import Weather_detail from "./assets/weather_detail";

function WeatherBox() {
    return (
        <div
            className="flex gap-10 p-6 border-4 border-white bg-gray-900 text-white 
                       sticky top-0 w-full z-50"
        >
            <div className="flex-1">
                <Weather_detail location="kuala lumpur" />
            </div>
            <div className="flex-1">
                <Weather_detail location="Selangor" />
            </div>
            <div className="flex-1">
                <Weather_detail location="hungary"/>
            </div>
        </div>
    );
}

export default WeatherBox;
