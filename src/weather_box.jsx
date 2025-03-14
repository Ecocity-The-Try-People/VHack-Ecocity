import Flood_homepage from "./flood_homepage";

function WeatherBox() {
    return (
        <div
            
            className="flex gap-10 p-6 border-4 border-white bg-gray-900 text-white 
                       sticky top-0 w-full z-50"
        >
            <div className="flex-1">
                <Flood_homepage location="kuala lumpur" />
            </div>
            <div className="flex-1">
                <Flood_homepage location="Selangor" />
            </div>
            <div className="flex-1">
                <Flood_homepage location="hungary"/>
            </div>
        </div>
    );
}

export default WeatherBox;
