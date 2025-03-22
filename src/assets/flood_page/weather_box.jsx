import Weather_detail from "./weather_detail";

function WeatherBox() {
    return (
        <div className="w-full flex gap-10 p-6 border-4 border-white bg-gray-900 text-white sticky top-0 z-50">
            <div className="flex-1">
                <Weather_detail location="kuala lumpur" />
            </div>
            <div className="flex-1">
                <Weather_detail location="Selangor" />
            </div>
            <div className="flex-1">
                <Weather_detail location="Cheras"/>
            </div>
        </div>
    );
}

export default WeatherBox;
