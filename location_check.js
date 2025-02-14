

    let locations = []; // Define locations globally

    async function loadLocations(file_name) {
        // Check if we're running locally or on GitHub Pages
        const filePath = window.location.hostname === "127.0.0.1" ? file_name : "https://raw.githubusercontent.com/bertvanlange/geolocked-links/refs/heads/main/" + file_name;

        try {
            // Fetch the JSON file from the correct path
            const response = await fetch(filePath);
            let l_temp = await response.json();
            console.log(l_temp);  // Display the locations in the console
            locations = l_temp.locations
            console.log(locations);  // Display the locations in the console

            // Continue with your logic to handle the locations here...
        } catch (error) {
            console.error("Error loading locations:", error);
        }
    }


    function checkUserLocation(userLat, userLon) {
        console.log(locations)
        if (locations.length === 0) {
            console.error("Locations not loaded yet.");
            return;
        }

        locations.forEach(location => {
            const loc = op_loc(userLat, userLon, location.lat, location.lon);

            if (loc) {  // Example distance threshold (in km)
            console.log("You're near this location! Link:", location.link);
            window.location.href = location.link; // Redirect to the location link
            return;
            }
        });

        console.log("You are not near any location.");
        }

    // Helper function to calculate the distance between two lat/lon points (Haversine formula)
    function op_loc(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        if(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) < 20/6371e3){
            return true
        }else{
            return false
        }
    }

    // Example usage (call the function with the user's actual lat/lon)
    // Replace with actual method to get the user's geolocation
    export function check_location_list(list_naem){
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            console.log(userLat)
            console.log(userLon)
            loadLocations(list_naem).then(() => {checkUserLocation(userLat, userLon);});
        });
    }