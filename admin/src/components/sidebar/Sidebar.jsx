import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import axios from "axios";

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);

  const downloadPDFStatementHandler = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    try {
      const response = await axios.get(`/transactions/${year}/${month}`);
      console.log(response.data);
      const link = response.data.link;
      const proxyUrl = "http://localhost:8800";
      const url = `${proxyUrl}${link}`;
      window.open(url, "_blank");
    } catch (err) {
      console.log(err);
    }
  };

  const downloadPDFReportsHandler = async (endpoint) => {
    try {
      const response = await axios.get(`/reports/${endpoint}`);
      console.log(response.data);
      const link = response.data.link;
      const proxyUrl = "http://localhost:8800";
      const url = `${proxyUrl}${link}`;
      window.open(url, "_blank");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Cabañas RD</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          <p className="title">LISTS</p>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>
          <Link to="/hotels" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Hotels</span>
            </li>
          </Link>
          <Link to="/rooms" style={{ textDecoration: "none" }}>
            <li>
              <CreditCardIcon className="icon" />
              <span>Rooms</span>
            </li>
          </Link>
          <p className="title">Descargas</p>
          <li onClick={downloadPDFStatementHandler}>
            <DownloadIcon className="icon" />
            <span>Transacciones</span>
          </li>
          <li onClick={() => downloadPDFReportsHandler("reservations")}>
            <DownloadIcon className="icon" />
            <span>Reservas</span>
          </li>
          <li onClick={() => downloadPDFReportsHandler("users")}>
            <DownloadIcon className="icon" />
            <span>Users</span>
          </li>
          <li onClick={() => downloadPDFReportsHandler("hotels")}>
            <DownloadIcon className="icon" />
            <span>Hotels</span>
          </li>
          <li onClick={() => downloadPDFReportsHandler("top10users")}>
            <DownloadIcon className="icon" />
            <span>Top 10 Users</span>
          </li>
          <li onClick={() => downloadPDFReportsHandler("tophotels")}>
            <DownloadIcon className="icon" />
            <span>Top Hotels</span>
          </li>
          <li>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
