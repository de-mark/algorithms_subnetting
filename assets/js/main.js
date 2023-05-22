const createSubnetDropdown = () => {
    for (let i = 30; i >= 0; i--){
        document.getElementById("subnetDropdown").innerHTML += `
        <option value="${i}">/${i}</option>
        `;
        //document.getElementById("exampleSubnetMask")
    }
}

createSubnetDropdown();