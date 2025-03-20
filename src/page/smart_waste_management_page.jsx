import MapView from "../assets/components/MapView";
import RequestPickup from "../assets/components/RequestPickup";

export default function smart_waste_management_page(){
    return (
        <div className="container">
          <h1 className="text-2xl font-bold text-center text-[var(--primary-color)] mb-6">
            Smart Waste Management
          </h1>
          
          <div className="card mb-6">
            <MapView />
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <RequestPickup />
            </div>
          </div>
        </div>
      );
    
}