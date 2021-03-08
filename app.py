from flask import Flask, render_template
from pyHS100 import Discover, SmartPlug
import json
 
 
app = Flask(__name__)
 
# Renders the index template on "/" 
@app.route("/")
def home():
    return render_template("index.html")
 
#  Returns a list of available devices stored in an array.
@app.route("/api/v1/devices")
def get_devices():
    devices = []
    for dev in Discover.discover().values():
        devices.append({ "alias": dev.alias, "state": dev.state, "emeter": dev.get_emeter_realtime(), "emeter_daily": dev.get_emeter_daily(year=2021, month=3), "emeter_last_month": dev.get_emeter_daily(year=2021, month=2) })
    
    return json.dumps(devices)
 
# toggles a device' state given an alias
@app.route("/api/v1/devices/toggle/<id>")
def toggle_device(id):
    for dev in Discover.discover().values():
        if dev.alias == id:
            if dev.state == "ON":
                dev.turn_off()
            else:
                dev.turn_on()
            return dev.state
 
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
