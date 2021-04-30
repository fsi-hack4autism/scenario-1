import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green, red, yellow, blue } from '@material-ui/core/colors';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import CodeForACauseService from '../services/CodeForACauseService';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const RedCheckbox = withStyles({
  root: {
    color: red[400],
    '&$checked': {
      color: red[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const YellowCheckbox = withStyles({
  root: {
    color: yellow[400],
    '&$checked': {
      color: yellow[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const BlueCheckbox = withStyles({
  root: {
    color: blue[400],
    '&$checked': {
      color: blue[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

function Device() {

  const classes = useStyles();
  let [deviceType, setDeviceType] = React.useState('');
  let [configRValue, setConfigRValue] = React.useState('');
  const [configBValue, setConfigBValue] = React.useState('');
  const [configYValue, setConfigYValue] = React.useState('');
  const [configGValue, setConfigGValue] = React.useState('');
  const [deviceId, setDeviceId] = React.useState('');
  const [therapistId, setTherapistId] = React.useState('');
  const [configName, setConfigName] = React.useState('');

  const handleConfigRValueChange = (event) => {
    setConfigRValue(event.target.value);
  };
  const handleConfigYValueChange = (event) => {
    setConfigYValue(event.target.value);
  };
  const handleConfigBValueChange = (event) => {
    setConfigBValue(event.target.value);
  };
  const handleConfigGValueChange = (event) => {
    setConfigGValue(event.target.value);
  };

  const handleDeivceTypeChange = (event) => {
    setDeviceType(event.target.value);
  };

  const handleTherapistIdChange = (event) => {
    setTherapistId(event.target.value);
  };

  const handleDeviceIdChange = (event) => {
    setDeviceId(event.target.value);
  };

  const handleConfigNameChange = (event) => {
    setConfigName(event.target.value);
  };

  const [state] = React.useState({
    checkedR: true,
    checkedG: true,
    checkedB: true,
    checkedY: true
  });

  const saveDeviceConfig = (event) => {
    var data = {
      DeviceId: deviceId,
      TherapistName: therapistId,
      ConfigurationName: configName,
      ConfigurationKVPair: {
        'BLUE' : configBValue,
        'GREEN' : configGValue,
        'YELLOW' : configYValue,
        'RED' : configRValue
      }
    };
    CodeForACauseService.saveDeviceConfig(data);
  };

  deviceType = 'logicAppSimulator';

  return (
    <div style={{ width: '100%' }}>
      <div className="header-padding"></div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Device Type: </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={deviceType}
          onChange={handleDeivceTypeChange}
        >
          <MenuItem value="logicAppSimulator">logicAppSimulator</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="simple-select-device-label">Device Id: </InputLabel>
        <Select labelId="simple-select-device-label"
          id="simple-select-device"
          value={deviceId}
          onChange={handleDeviceIdChange}>
          <MenuItem value='device_id_1'>device_id_1</MenuItem>
          <MenuItem value='device_id_2'>device_id_2</MenuItem>
          <MenuItem value='device_id_3'>device_id_3</MenuItem>
          <MenuItem value='device_id_4'>device_id_4</MenuItem>
          <MenuItem value='device_id_5'>device_id_5</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-therapist-label">Therapist: </InputLabel>
        <Select
          labelId="demo-simple-therapist-label"
          id="simple-select-therapist"
          value={therapistId}
          onChange={handleTherapistIdChange}
        >
          <MenuItem value="Krishna Golla">Krishna Golla</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <TextField required id="standard-required" label="Configuration Name" onChange={handleConfigNameChange}
          defaultValue={configName} />
      </FormControl>
      <FormGroup row>
        <FormControlLabel disabled
          control={<GreenCheckbox checked={state.checkedG} name="checkedG" />}
        />
        <TextField id="standard-required" label="Name" defaultValue={configGValue} onChange={handleConfigGValueChange}/>
        <FormControlLabel disabled
          control={<RedCheckbox checked={state.checkedR} name="checkedR" />}
        />
        <TextField id="standard-required" label="Name" defaultValue={configRValue} onChange={handleConfigRValueChange}/>
        <FormControlLabel disabled
          control={<YellowCheckbox checked={state.checkedY} name="checkedY" />}
        />
        <TextField id="standard-required" label="Name" defaultValue={configYValue} onChange={handleConfigYValueChange}/>
        <FormControlLabel disabled
          control={<BlueCheckbox checked={state.checkedB} name="checkedB" />}
        />
        <TextField id="standard-required" label="Name" defaultValue={configBValue} onChange={handleConfigBValueChange}/>
      </FormGroup>
      <br/><br/>
      <Button variant="contained" color="primary" onClick={saveDeviceConfig}>
        Save Configuration
      </Button>
    </div>
  )
}
export default Device;