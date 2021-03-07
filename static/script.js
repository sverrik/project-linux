//Async koyrur samstundis sum onnur kota. IIFE Immediate Invoke Function Expression (klombri runt um async og tey í endanum.).
//fetch leitur eftir devices og bíðar eftir svari. Await riggar bara saman við async. 
 
// list of devices
let devices = [];
 
/**
 * On Load
 * IIFE, Immediate Invoke Function Expression
 * Run this function immediately
 */
(async function () {
    // fetch all devices from API
    const response = await fetch('/api/v1/devices');
    // convert data to json
    const json = await response.json();
 
    devices = json;
    
    // create a chart of the first device
    createChart(devices[0].alias);
 
    // remove the loader
    document.querySelector(".loader-container").style.display = 'none';
    
    // the parent container
    const element = document.querySelector('.devices');
 
    // loop through devices
    for (const device of json) {
        // create a child element for each device
        const child = document.createElement('div');
 
        // add 'device' class
        child.classList.add('device');
 
        // when a 'device' element is clicked, toggle the device's state
        child.addEventListener('click', () => {
            toggleState(child, device.alias);
        });
        
        // add switch to the device
        child.innerHTML = `<div>${device.alias}</div> <div class="switch ${device.state === 'ON' ? ' active' : ''}"><input type="checkbox" v-model="value" /></div>`;
 
        // append the device to the parents
        element.appendChild(child);
    }
})();
 
/**
 * Toggle a device's state.
 * @param {*} element 
 * @param {*} id 
 */
async function toggleState(element, id) {
    // get device's switch
    const switchElement = element.querySelector(".switch");
 
    // toggle its active class
    switchElement.classList.toggle('active');
 
    // set the chart to toggled device
    createChart(id);
 
    // call the API to toggle the device FOR REAL
    await fetch(`/api/v1/devices/toggle/${id}`);
}
 
/**
 * Create a chart given an id.
 * @param {*} id 
 */
async function createChart(id) {
    // find the device in the list of devices
    const json = devices.find(device => device.alias === id);
 
    // if the device does not exist, return
    if (!json) {
        return;
    }
 
    const emeter_daily = json.emeter_daily;
    const emeter_last_month = json.emeter_last_month;
 
    // create the first chart using Chart.js
    (function() {
        // get the canvas context
        var ctx = document.getElementById('myChart').getContext('2d');
        // initialize Chart.js with the context
        new Chart(ctx, {
            type: 'line',
    
            data: {
                labels: Object.keys(emeter_last_month),
                datasets: [{
                    label: 'February 2021',
                    borderColor: 'rgb(255, 99, 132)',
                    data: [... Object.values(emeter_last_month)]
                }]
            },
    
            options: {}
        });
    })();
 
    // create the second chart using Chart.js
    (function() {
        // get the canvas context
        var ctx = document.getElementById('myChart2').getContext('2d');
        // initialize Chart.js with the context
        new Chart(ctx, {
            type: 'line',
    
            data: {
                labels: Object.keys(emeter_daily),
                datasets: [{
                    label: 'March 2021',
                    borderColor: 'rgb(255, 99, 132)',
                    data: [... Object.values(emeter_daily)]
                }]
            },
    
            options: {}
        });
    })();
}
