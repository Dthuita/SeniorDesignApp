from pydexarm import Dexarm 
import time 
import sys
    
'''windows''' 
dexarm = Dexarm(port="COM67") 
    
'''mac & linux'''
# device = Dexarm(port="/dev/tty.usbmodem3086337A34381")
    
dexarm.go_home()


'''move right'''
dexarm.move_to(100, 300, 0)
dexarm.go_home()
'''move up'''
dexarm.move_to(0, 300, 100)
dexarm.go_home()
'''move in'''
dexarm.move_to(0, 230, 0)
dexarm.go_home()
'''move up'''
dexarm.move_to(0, 300, 100)
dexarm.go_home()


'ender'
dexarm.close()