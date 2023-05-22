const networkComponent = document.getElementById("networkEntry");
const dropdownComponent = document.getElementById("subnetDropdown");



const createSubnetDropdown = () => {
    dropdownComponent.innerHTML = ""

    for (let i = 30; i >= 0; i--){
        dropdownComponent.innerHTML += `
        <option value="${i}">/${i}</option>
        `;
        //document.getElementById("exampleSubnetMask")
    }
    dropdownComponent.value = "30";
}

const processSubnet = () => {
    let currentNetwork = networkComponent.value;
    let currentSubnet = dropdownComponent.value;

        alert(`NETWORK - ${currentNetwork} SUBNET - ${currentSubnet}`);
}



createSubnetDropdown();