import * as React from "react";
import "../static/css/SideDrawer.css"


class SideDrawer extends React.PureComponent {
    render() {
        return (
            <div id="mySidenav" className="sidenav">
                <a href="javascript:void(0)" className="closebtn">&times;</a>
                <a href="#">About</a>
                <a href="#">Services</a>
                <a href="#">Clients</a>
                <a href="#">Contact</a>
            </div>
        )
    }
}

export default SideDrawer
