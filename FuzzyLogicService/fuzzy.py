import numpy as np
import skfuzzy as fuzz
import skfuzzy.control

from skfuzzy import *
import time

class FuzzySystem:

    def __init__(self,temperature_start=0,temperature_stop=10,moisture_start=0,moisture_stop=10,time_start=0,time_stop=10):
        """
        temperature : air temperature (degree Celsius)
        moisture : soil moisture (%)
        time : watering time (minutes)
        """
        self.__temperature_start = temperature_start
        self.__temperature_stop = temperature_stop
        self.__moisture_start = moisture_start
        self.__moisture_stop = moisture_stop
        self.__time_start = time_start
        self.__time_stop = time_stop

    def set_temperature_low_start(self, start):
        self.__temperature_low_start = start

    def set_temperature_low_mid1(self, mid1):
        self.__temperature_low_mid1 = mid1

    def set_temperature_low_mid2(self, mid2):
        self.__temperature_low_mid2 = mid2

    def set_temperature_low_stop(self, stop):
        self.__temperature_low_stop = stop

    def set_temperature_mod_start(self, start):
        self.__temperature_mod_start = start

    def set_temperature_mod_mid(self, mid):
        self.__temperature_mod_mid = mid

    def set_temperature_mod_stop(self, stop):
        self.__temperature_mod_stop = stop

    def set_temperature_high_start(self, start):
        self.__temperature_high_start = start

    def set_temperature_high_mid1(self, mid1):
        self.__temperature_high_mid1 = mid1

    def set_temperature_high_mid2(self, mid2):
        self.__temperature_high_mid2 = mid2

    def set_temperature_high_stop(self, stop):
        self.__temperature_high_stop = stop

    def set_temperature_low(self, start, mid1, mid2, stop):
        self.set_temperature_low_start(start)
        self.set_temperature_low_mid1(mid1)
        self.set_temperature_low_mid2(mid2)
        self.set_temperature_low_stop(stop)

    def set_temperature_mod(self, start, mid, stop):
        self.set_temperature_mod_start(start)
        self.set_temperature_mod_mid(mid)
        self.set_temperature_mod_stop(stop)

    def set_temperature_high(self, start, mid1, mid2, stop):
        self.set_temperature_high_start(start)
        self.set_temperature_high_mid1(mid1)
        self.set_temperature_high_mid2(mid2)
        self.set_temperature_high_stop(stop)

    def set_temperature(self, low_start, low_mid1, low_mid2, low_stop, mod_start, mod_mid, mod_stop, high_start, high_mid1, high_mid2, high_stop):
        self.set_temperature_low(low_start, low_mid1, low_mid2, low_stop)
        self.set_temperature_mod(mod_start, mod_mid, mod_stop)
        self.set_temperature_high(high_start, high_mid1, high_mid2, high_stop)

    def set_moisture_low_start(self, start):
        self.__moisture_low_start = start

    def set_moisture_low_mid1(self, mid1):
        self.__moisture_low_mid1 = mid1

    def set_moisture_low_mid2(self, mid2):
        self.__moisture_low_mid2 = mid2

    def set_moisture_low_stop(self, stop):
        self.__moisture_low_stop = stop

    def set_moisture_mod_start(self, start):
        self.__moisture_mod_start = start

    def set_moisture_mod_mid(self, mid):
        self.__moisture_mod_mid = mid

    def set_moisture_mod_stop(self, stop):
        self.__moisture_mod_stop = stop

    def set_moisture_high_start(self, start):
        self.__moisture_high_start = start

    def set_moisture_high_mid1(self, mid1):
        self.__moisture_high_mid1 = mid1

    def set_moisture_high_mid2(self, mid2):
        self.__moisture_high_mid2 = mid2

    def set_moisture_high_stop(self, stop):
        self.__moisture_high_stop = stop

    def set_moisture_low(self, start, mid1, mid2, stop):
        self.set_moisture_low_start(start)
        self.set_moisture_low_mid1(mid1)
        self.set_moisture_low_mid2(mid2)
        self.set_moisture_low_stop(stop)

    def set_moisture_mod(self, start, mid, stop):
        self.set_moisture_mod_start(start)
        self.set_moisture_mod_mid(mid)
        self.set_moisture_mod_stop(stop)

    def set_moisture_high(self, start, mid1, mid2, stop):
        self.set_moisture_high_start(start)
        self.set_moisture_high_mid1(mid1)
        self.set_moisture_high_mid2(mid2)
        self.set_moisture_high_stop(stop)

    def set_moisture(self, low_start, low_mid1, low_mid2, low_stop, mod_start, mod_mid, mod_stop, high_start, high_mid1, high_mid2, high_stop):
        self.set_moisture_low(low_start, low_mid1, low_mid2, low_stop)
        self.set_moisture_mod(mod_start, mod_mid, mod_stop)
        self.set_moisture_high(high_start, high_mid1, high_mid2, high_stop)

    def set_time_short_start(self, start):
        self.__time_short_start = start

    def set_time_short_mid1(self, mid1):
        self.__time_short_mid1 = mid1

    def set_time_short_mid2(self, mid2):
        self.__time_short_mid2 = mid2

    def set_time_short_stop(self, stop):
        self.__time_short_stop = stop

    def set_time_nor_start(self, start):
        self.__time_nor_start = start

    def set_time_nor_mid1(self, mid1):
        self.__time_nor_mid1 = mid1

    def set_time_nor_mid2(self, mid2):
        self.__time_nor_mid2 = mid2

    def set_time_nor_stop(self, stop):
        self.__time_nor_stop = stop

    def set_time_long_start(self, start):
        self.__time_long_start = start

    def set_time_long_mid1(self, mid1):
        self.__time_long_mid1 = mid1

    def set_time_long_mid2(self, mid2):
        self.__time_long_mid2 = mid2

    def set_time_long_stop(self, stop):
        self.__time_long_stop = stop

    def set_time_short(self, start, mid1, mid2, stop):
        self.set_time_short_start(start)
        self.set_time_short_mid1(mid1)
        self.set_time_short_mid2(mid2)
        self.set_time_short_stop(stop)

    def set_time_nor(self, start, mid1, mid2, stop):
        self.set_time_nor_start(start)
        self.set_time_nor_mid1(mid1)
        self.set_time_nor_mid2(mid2)
        self.set_time_nor_stop(stop)

    def set_time_long(self, start, mid1, mid2, stop):
        self.set_time_long_start(start)
        self.set_time_long_mid1(mid1)
        self.set_time_long_mid2(mid2)
        self.set_time_long_stop(stop)

    def set_time(self, short_start, short_mid1, short_mid2, short_stop, nor_start, nor_mid1, nor_mid2, nor_stop, long_start, long_mid1, long_mid2, long_stop):
        self.set_time_short(short_start, short_mid1, short_mid2, short_stop)
        self.set_time_nor(nor_start, nor_mid1, nor_mid2, nor_stop)
        self.set_time_long(long_start, long_mid1, long_mid2, long_stop)

    def make_rules(self):
        """
            Create Fuzzy Rules
            :return:
        """
        rule1 = skfuzzy.control.Rule(self.__temperature['cold'] & self.__moisture['dry'], self.__time['long'])
        rule2 = skfuzzy.control.Rule(self.__temperature['cold'] & self.__moisture['normal'], self.__time['short'])
        rule3 = skfuzzy.control.Rule(self.__temperature['cold'] & self.__moisture['wet'], self.__time['very short'])
        rule4 = skfuzzy.control.Rule(self.__temperature['normal'] & self.__moisture['dry'], self.__time['long'])
        rule5 = skfuzzy.control.Rule(self.__temperature['normal'] & self.__moisture['normal'], self.__time['short'])
        rule6 = skfuzzy.control.Rule(self.__temperature['normal'] & self.__moisture['wet'], self.__time['very short'])
        rule7 = skfuzzy.control.Rule(self.__temperature['hot'] & self.__moisture['dry'], self.__time['long'])
        rule8 = skfuzzy.control.Rule(self.__temperature['hot'] & self.__moisture['normal'], self.__time['short'])
        rule9 = skfuzzy.control.Rule(self.__temperature['hot'] & self.__moisture['wet'], self.__time['very short'])
        """
            Create a control system
        """
        self.__rules = []
        for i in range(1, 9):
            self.__rules.append(eval("rule" + str(i)))
        self.__time_ctrl = skfuzzy.control.ControlSystem(self.__rules)
        #self.__time_ctrl.view()

    def make_variables(self):
        """
            Create input, output variables
        :return:
        """
        self.__temperature = skfuzzy.control.Antecedent(np.arange(self.__temperature_start, self.__temperature_stop), 'Temperature')
        self.__moisture = skfuzzy.control.Antecedent(np.arange(self.__moisture_start, self.__moisture_stop), 'Moisture')
        self.__time = skfuzzy.control.Consequent(np.arange(self.__time_start, self.__time_stop), 'Time')

    def make_member_functions(self):
        """
            Create member functions
        :return:
        """
        self.__temperature['cold'] = fuzz.trapmf(self.__temperature.universe, [self.__temperature_low_start,
                                                                               self.__temperature_low_mid1,
                                                                              self.__temperature_low_mid2,
                                                                              self.__temperature_low_stop])
        self.__temperature['normal'] = fuzz.trimf(self.__temperature.universe, [
                                                                                 self.__temperature_mod_start,
                                                                                self.__temperature_mod_mid,
                                                                                self.__temperature_mod_stop])
        self.__temperature['hot'] = fuzz.trapmf(self.__temperature.universe, [self.__temperature_high_start,
                                                                              self.__temperature_high_mid1,
                                                                             self.__temperature_high_mid2,
                                                                             self.__temperature_high_stop])
        self.__moisture['dry'] = fuzz.trapmf(self.__moisture.universe, [self.__moisture_low_start,
                                                                        self.__moisture_low_mid1,
                                                                          self.__moisture_low_mid2,
                                                                          self.__moisture_low_stop])
        self.__moisture['normal'] = fuzz.trimf(self.__moisture.universe, [
                                                                           self.__moisture_mod_start,
                                                                          self.__moisture_mod_mid,
                                                                          self.__moisture_mod_stop])
        self.__moisture['wet'] = fuzz.trapmf(self.__moisture.universe, [self.__moisture_high_start,
                                                                        self.__moisture_high_mid1,
                                                                             self.__moisture_high_mid2,
                                                                             self.__moisture_high_stop])
        self.__time['very short'] = fuzz.trapmf(self.__time.universe, [self.__time_short_start,
                                                                       self.__time_short_mid1,
                                                                             self.__time_short_mid2,
                                                                             self.__time_short_stop])
        self.__time['short'] = fuzz.trapmf(self.__time.universe, [self.__time_nor_start,
                                                                  self.__time_nor_mid1,
                                                                 self.__time_nor_mid2,
                                                                 self.__time_nor_stop])
        self.__time['long'] = fuzz.trapmf(self.__time.universe, [self.__time_long_start,
                                                                 self.__time_long_mid1,
                                                                 self.__time_long_mid2,
                                                                 self.__time_long_stop])

    def simulate(self, temperature_val, moisture_val):
        try:
            time_ctrl_sil = skfuzzy.control.ControlSystemSimulation(self.__time_ctrl)
            time_ctrl_sil.input['Temperature'] = temperature_val
            time_ctrl_sil.input['Moisture'] = moisture_val
            time_ctrl_sil.compute()
            return time_ctrl_sil.output['Time']
        except:
            return 0.0


if __name__ == '__main__':
    fuzzy_system = FuzzySystem(0, 45, 0, 100, 0, 30)
    fuzzy_system.set_temperature(-15, -12.5, 12.5, 17, 12.5, 25, 37.5, 30, 37.5, 55.5, 58)
    fuzzy_system.set_moisture(-40, -20, 20, 40, 20, 50, 80, 60, 80, 100, 120)
    fuzzy_system.set_time(-5, -2, 2, 5, 2, 5, 8, 12, 8, 12, 20, 25)
    fuzzy_system.make_variables()
    fuzzy_system.make_member_functions()
    fuzzy_system.make_rules()

    print(fuzzy_system.simulate(30, 10))
