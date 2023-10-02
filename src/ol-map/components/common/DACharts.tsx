import * as React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from "highcharts/modules/exporting";
// import Api, {APIs} from "../../../../Api";

interface IPorps {
  chartData: any;
}

// example of calling <DAChart a={"x"}/>
const DAChart = (props: IPorps) => {
  // const params = useSelector((state: any) => state.dashboard)
  // const navigate = useNavigate();
  const data = props.chartData;
  if (typeof Highcharts === "object") {
    HighchartsExporting(Highcharts);
  }
  // const [chartData, setDAChart] = useState([]);
  // useEffect(() => {
  //     Api.get(APIs.EAD_DONOR_DIST, params).then((payload: any) => {
  //         if (payload) {
  //             setDAChart(payload)
  //         }
  //     })
  // }, [params])
  // const data = chartData.map((info: any) => ({
  //     name: info.name,
  //     y: info.amount,
  //     amount: info.amount,
  //     projects: info.projects,
  //     sliced: true
  // }))
  const chartOptions = {
    chart: {
      type: "pie",
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        depth: 45,
        allowPointSelect: true,
        colors: [
          "#2458a7",
          "#ee330c",
          "#918f7e",
          "#ffad0a",
          "#0022ff",
          "#5b9411",
          "#11284d",
          "#942308",
        ],
        cursor: "pointer",
        dataLabels: {
          y: -15,
          x: 8,
          padding: -5,
          zIndex: 50,
          softConnector: false,
          style: {
            textOverflow: "ellipsis",
            fontSize: "10px",
            fontStyle: "bold",
          },
          useHTML: true,
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
      // series: {
      //     innerSize: '50%',
      //     point: {
      //         events: {
      //             click: function (e: any) {
      //                 const name = e.point.name.replace("/", "$")
      //                 let p = "";
      //                 let i = 0;
      //                 for (let key in params) {
      //                     let value = params[key]
      //                     if (key == "donor") {
      //                         value = name
      //                     }
      //                     p += i == 0 ? `${key}=${value}` : `&${key}=${value}`
      //                     i++
      //                 }
      //                 // navigate("/projects?" + p)
      //             }
      //         }
      //     }
      // }
    },
    series: [
      {
        name: "Area",
        colorByPoint: true,
        data: data,
      },
    ],
  };
  return (
    <React.Fragment>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </React.Fragment>
  );
};
export default DAChart;
