export function formatAddress(address1 : string, address2 : string, 
    city : string, state : string, zipcode : string) {
    // Combine address components into a single line
    let addressLine = `${address1}${address2 ? ' ' + address2 : ''}, ${city}, ${state} ${zipcode}`;
    return addressLine;
  }
  
export function parseAddress(addressLine : string) {
    // Split the address line into components
    const parts = addressLine.split(', ');
    
    // Extract city, state, and zipcode
    const cityStateZip = parts.pop() as string;
    const [city, stateZip] = cityStateZip.split(', ');
    const [state, zipcode] = stateZip.split(' ');
    
    // Extract address1 and address2
    const addressParts = parts.join(', ').split(' ');
    const address2 = addressParts.length > 2 ? addressParts.pop() : '';
    const address1 = addressParts.join(' ');
    
    return {
      address1,
      address2,
      city,
      state,
      zipcode
    };
  }
