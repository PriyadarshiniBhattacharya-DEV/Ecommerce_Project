import React from "react";
import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer} from "recharts";
function SalesReport(){
    const salesData=[
        {month:"January", sales:12000},
        {month:"February", sales:10000},
        {month:"March", sales:14000},
        {month:"April", sales:22000},
        {month: "May", sales:20000}
    ]
    return(
    <div>
        <h1>Sales Report</h1>
        <div className="card shadow p-4">
            <h4>Monthly Sales</h4>
                <LineChart  width={700} height={500} data={salesData}>
                    <CartesianGrid/>
                    <XAxis dataKey="month"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={3}/>
                </LineChart>
        </div>
    </div>
    );
}
export default SalesReport;