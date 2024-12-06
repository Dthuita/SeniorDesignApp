//imports
const express = require('express')
const cors = require('cors')
const fs = require('fs').promises //needed for async/await functionality
const { spawnSync, execSync } = require('child_process');


//vars
const app = express()
const PORT = 4040;

//middleware
app.use(cors())
app.use(express.json())

const writeBoilerplate = async() => {
    const bp = `from pydexarm import Dexarm \nimport time \nimport sys
    \n'''windows''' \ndexarm = Dexarm(port="COM19") 
    \n'''mac & linux'''\n# device = Dexarm(port="/dev/tty.usbmodem3086337A34381")
    \ndexarm.go_home()\n\n`;

    try{
        await fs.writeFile('motionTest.py', bp, 'utf8')
    }catch(err){
        console.log(err);
    }
    console.log('File created and boilerplate written successfully!');
}
const addMotions = async(mlist) => {
    let motionCMD = '';

    //transform array to python code
    mlist.map(ml => {
        if(ml == '-X')
            motionCMD += `'''move left'''\ndexarm.move_to(-100, 300, 0)\ndexarm.go_home()\n`;
        else if(ml == '+X')
            motionCMD += `'''move right'''\ndexarm.move_to(100, 300, 0)\ndexarm.go_home()\n`;
        else if(ml == '-Y')
            motionCMD += `'''move in'''\ndexarm.move_to(0, 230, 0)\ndexarm.go_home()\n`;
        else if(ml == '+Y')
            motionCMD += `'''move out'''\ndexarm.move_to(0, 350, 0)\ndexarm.go_home()\n`;
        else if(ml == '-Z')
            motionCMD += `'''move down'''\ndexarm.move_to(0, 300, -100)\ndexarm.go_home()\n`;
        else if(ml == '+Z')
            motionCMD += `'''move up'''\ndexarm.move_to(0, 300, 100)\ndexarm.go_home()\n`;
        else    
            motionCMD += '\n';
    });
    motionCMD += "\n\n'ender'\ndexarm.close()";

    try{
        await fs.appendFile('motionTest.py', motionCMD, 'utf8')
    }catch(err){
        console.log(err);
    }
    console.log('Custom motion code added successfully!');
}
const executeFile = async() => {
    const filename = ['pythonTester.py', 'motionTest.py'];
    //NOTE: MUST handle data from spawnSync properly for it to run right

    console.log('running file: ', filename[1]);

    const pythonProcess = spawnSync('python3', [filename[1]]);
    const result = pythonProcess.stdout?.toString()?.trim(); //make stdout human readable
    const error = pythonProcess.stderr?.toString()?.trim();  //make stdout human readable
   
    // console.log('result of process: ', pythonProcess);
    // console.log('result of result: ', result);
    // console.log('result of error: (', error, ')');

    const status = error !== ' '; // if no error (i.e. ' ') 
    let returnData;

    if (status) {
        returnData = {cmd: result, status: 1};
        console.log('Results: ', result)
    } else {
        returnData = {cmd: error, status: 0};
       console.log('Error: ', error)
    }
    return returnData;
}

app.post('/move', async(req, res, next) => { //req should include array of motions
    //extract array from request body
    const pseudocode = req.body;
    console.log('motion list array: ', pseudocode);
    
    //write python script
    await writeBoilerplate();
    //extract array from req body
    await addMotions(pseudocode);

    //run python script
    let pyRes = await executeFile();

    // console.log("pyRes: ", pyRes);
    // pyRes = (pyRes==0) ? 200 : 503;
    if(pyRes.status == 1){
        res.send('task complete!');
    }else{
        res.send('Error Occured!!!!');
    }
})

app.get('/hi', (req, res) => {
    console.log('server live!')
    res.send('hello there :)');
})

app.listen(PORT, () => {
    console.log(`Example app listening on  http://localhost:${PORT}/`);
})

/* DexArm notes
- need to git pull dexArm api and keep folder near by to actually use the dexarm api for python
- get DexArm api from https://github.com/Rotrics-Dev/DexArm_API

NOTE: MUST use python3 to run (not python) i.e. python3 DexArm_API-master/pydexarm/example.py
NOTE: add try except statements within python file for better error catching
    1. add in boiler plate
    2. only write at specific points
        - check if file exists
        -
*/
//