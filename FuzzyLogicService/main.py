from flask import Flask, escape, request
app = Flask(__name__)
from fuzzy import FuzzySystem

fuzzy_system = FuzzySystem(0, 45, 0, 100, 0, 30)
fuzzy_system.set_temperature(-15, -12.5, 12.5, 17, 12.5, 25, 37.5, 30, 37.5, 55.5, 58)
fuzzy_system.set_moisture(-40, -20, 20, 40, 20, 50, 80, 60, 80, 100, 120)
fuzzy_system.set_time(-5, -2, 2, 5, 2, 5, 8, 12, 8, 12, 20, 25)
fuzzy_system.make_variables()
fuzzy_system.make_member_functions()
fuzzy_system.make_rules()


@app.route('/')
def index():
    temperature = request.args.get("temperature", "0.0")
    moisture = request.args.get("moisture", "0.0")
    print(temperature, moisture)
    return str(fuzzy_system.simulate(float(temperature), float(moisture)))
