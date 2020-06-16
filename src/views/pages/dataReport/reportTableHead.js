
export default {
  data () {
    return {
      reportTableHead: [
        {
          label: 'SN',
          prop: 'sn',
          checked: true,
          width: 120
        }, {
          label: 'Master State/10500',
          prop: 'masterState',
          checked: true,
          width: 160
        }, {
          label: 'Check Time/10501',
          prop: 'checkTime',
          checked: true,
          width: 145
        }, {
          label: 'E_today/10503',
          prop: 'eToday',
          checked: true,
          width: 140
        }, {
          label: 'E_total/10504',
          prop: 'eTotal',
          checked: true,
          width: 140
        }, {
          label: 'Feed-in Power/10506',
          prop: 'feedinPower',
          checked: true,
          width: 165
        }, {
          label: 'OutputPower/10507',
          prop: 'outputPower',
          checked: true,
          width: 160
        }, {
          label: 'Loadpower/10508',
          prop: 'loadPower',
          checked: true,
          width: 160
        }, {
          label: 'BatPower/10509',
          prop: 'batPower',
          checked: true,
          width: 140
        }, {
          label: 'Gird Voltage R/10700',
          prop: 'gridVoltagR',
          checked: true,
          width: 165
        }, {
          label: 'Grid Current R/10701',
          prop: 'gridCurrentR',
          checked: true,
          width: 165
        }, {
          label: 'Grid Frequency R/10702',
          prop: 'gridFrequencyR',
          checked: true,
          width: 185
        }, {
          label: 'Gird Voltage R/10700',
          prop: 'gridVoltagR',
          checked: true,
          width: 170
        }, {
          label: 'Current R Power /10703',
          prop: 'currentRPower',
          checked: true,
          width: 185
        }, {
          label: 'Gird Voltage R/10700',
          prop: 'gridVoltagR',
          checked: true,
          width: 170
        }, {
          label: 'Gird Voltage S/10704',
          prop: 'gridVoltagS',
          checked: true,
          width: 170
        }, {
          label: 'Grid Current S/10705',
          prop: 'gridCurrentS',
          checked: true,
          width: 170
        }, {
          label: 'Current S Power /10707',
          prop: 'currentSPower',
          checked: true,
          width: 180
        }, {
          label: 'Gird Voltage T/10708',
          prop: 'gridVoltagT',
          checked: true,
          width: 170
        }, {
          label: 'Grid Current T/10709',
          prop: 'gridCurrentT',
          checked: true,
          width: 170
        }, {
          label: 'Current T Power/10711',
          prop: 'currentTPower',
          checked: true,
          width: 180
        }, {
          label: 'Pv 1 Voltage/10800',
          prop: 'gridVoltagT',
          checked: true,
          width: 160
        }, {
          label: 'Gird Voltage T/10708',
          prop: 'pv1Voltage',
          checked: true,
          width: 180
        }, {
          label: 'Pv 1 Current/10801',
          prop: 'pv1Current',
          checked: true,
          width: 160
        }, {
          label: 'Pv 2 Voltage/10803',
          prop: 'pv2Voltage',
          checked: true,
          width: 160
        }, {
          label: 'Pv 2 Current/10804',
          prop: 'pv2Current',
          checked: true,
          width: 160
        }, {
          label: 'Pv 3 Voltage/10806',
          prop: 'pv3Voltage',
          checked: true,
          width: 160
        }, {
          label: 'Pv 2 Current/10804',
          prop: 'pv2Current',
          checked: true,
          width: 160
        }, {
          label: 'Pv 3 Current/10807',
          prop: 'pv3Current',
          checked: true,
          width: 160
        }, {
          label: 'Pv 4 Voltage/10809',
          prop: 'pv4Volage',
          checked: true,
          width: 160
        }, {
          label: 'Pv 4 Current/10810',
          prop: 'pv4Current',
          checked: true,
          width: 160
        }, {
          label: 'Inv Temperature/11201',
          prop: 'invTemperature',
          checked: true,
          width: 180
        }, {
          label: 'ambient Temperature/11202',
          prop: 'ambientTemerature',
          checked: true,
          width: 220
        }, {
          label: 'Eps Voltage R/11300',
          prop: 'epsVoltageR',
          checked: true,
          width: 160
        }, {
          label: 'Eps Current R/11301',
          prop: 'epsCurrentR',
          checked: true,
          width: 160
        }, {
          label: 'Eps Power R/11302',
          prop: 'epsPowerR',
          checked: true,
          width: 160
        }, {
          label: 'Eps Voltage S/11305',
          prop: 'epsVoltageS',
          checked: true,
          width: 160
        }, {
          label: 'Eps Current S/11306',
          prop: 'epsCurrentS',
          checked: true,
          width: 160
        }, {
          label: 'Eps Power S/11307',
          prop: 'epsPowerS',
          checked: true,
          width: 160
        }, {
          label: 'Eps Voltage T/11310',
          prop: 'epsVoltageT',
          checked: true,
          width: 160
        }, {
          label: 'Eps Current T/11311',
          prop: 'epsCurrentT',
          checked: true,
          width: 160
        }, {
          label: 'Eps Power T/11312',
          prop: 'epsPowerT',
          checked: true,
          width: 160
        }, {
          label: 'Eps Voltage T/11310',
          prop: 'epsVoltageT',
          checked: true,
          width: 160
        }, {
          label: 'Rev.10',
          prop: 'rev10',
          checked: true,
          fixed: 'right'
        }, {
          label: 'Rev.11',
          prop: 'rev11',
          checked: true,
          fixed: 'right'
        }, {
          label: 'Rev.12',
          prop: 'rev12',
          checked: true,
          fixed: 'right'
        }, {
          label: 'Rev.13',
          prop: 'rev13',
          checked: true,
          fixed: 'right'
        }, {
          label: 'Rev.14',
          prop: 'rev14',
          checked: true,
          fixed: 'right'
        }, {
          label: 'Rev.15',
          prop: 'rev15',
          checked: true,
          fixed: 'right'
        }
      ]
    }
  }
}
