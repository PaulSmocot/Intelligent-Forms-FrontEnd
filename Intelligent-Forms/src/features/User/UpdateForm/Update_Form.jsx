import React, { useState } from "react";
import NavBar2 from "../NavBar2";
import "./UpdateForm.css";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import { Divider, IconButton, Pagination } from "@mui/material";
import FormActions from "./FormActions";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { getTemplatesByUserId } from "../../API/TemplateAPI/TemplateAPI";
import { useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import 'primeicons/primeicons.css';
import { deleteTemplateById } from "../../API/TemplateAPI/TemplateAPI";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {QRCodeCanvas} from 'qrcode.react';


function Update_Form(props) {
 const navigate = useNavigate()
 const [hover, setHover] = useState(false);
  const deleteTemplate = async(activeTemplateId)=>{
    Swal.fire({
      title: 'Do you want to delete the form?',
      //text: "Deleting the form will result in deleting all it's submission",
      icon: 'warning',
      iconColor:'red',
      showCancelButton: true,
      confirmButtonColor: '#6e8cc7',
      cancelButtonColor: '#d95050',
      confirmButtonText: 'Yes!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteTemplateById(activeTemplateId);
       
        window.location.reload()
      }
    })
  }



const rowsPerPage = 5;

function MyTable({data, OnAction}){
  const [page, setPage] = React.useState(0);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const start = page * rowsPerPage;
  const end = start + rowsPerPage;
  const rows = data.slice(start, end);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <TableContainer>
  <Table style={{ tableLayout: 'fixed' }}>
    <TableHead>
      <TableRow>
        <TableCell className="Details" style={{paddingLeft:'10%'}} key={"formTitle"}  align="left">{"Title"}</TableCell>
        <TableCell className="Details" key={"fillFormLink"} align="center">{"Fill Link"}</TableCell>
        <TableCell className="Details" key={"QRCode"} align="center">{"QR Code"}</TableCell>
        <TableCell className="Details" key={"formActions"} align="center">{"Actions"}</TableCell>

      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id}>
        <TableCell style={{paddingLeft:'10%'}} key={'formTitle'} align="center">
        <span style={{ display: 'flex', alignItems: 'center', justifyContent:'left', align:'center',    fontSize:'13px'}}>
          <PictureAsPdfIcon style={{ marginRight: '5px', verticalAlign: 'middle', align:'center' }} />
          {row.formTitle}
        </span>
      </TableCell>
          <TableCell key={'fillFormLink'} align="center">
            <a style={{fontSize:"13px"}} href={`/#/FillForm/${row.id}`}>
              {`intelligentforms.azurewebsites/#/FillForm/${row.id}`}
            </a>
          </TableCell>
          <TableCell key={'fillFormLink'} align="center">
          <QRCodeCanvas style={{width:'50px', height:'50px'}} value={`intelligentforms.azurewebsites.net/#/FillForm/${row.id}`}/>
          </TableCell>
          <TableCell key={'formActions'} align="center" className="tableDetails">
           <Tooltip title="View">
            <IconButton>
            <span><VisibilityIcon className="iconDetails" onClick={()=>{window.location.href=(`#/Submissions_Forms/${row.id}`)}} style={{ fontSize: '1.rem' }}/> </span>
            </IconButton>
           </Tooltip>
            
           
            <Tooltip title="Delete">
              <IconButton>
                <span><DeleteIcon  className="deleteIcon "  onClick={()=>deleteTemplate(row.id)}/></span>
                </IconButton>
             </Tooltip>
               
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'50px' }}>
  <TablePagination
    rowsPerPageOptions={[]}
    component="div"
    count={data.length}
    rowsPerPage={rowsPerPage}
    page={page}
    onPageChange={handleChangePage}
  />
</div>
    </TableContainer>
  );
}


  const [data, setData] = useState(null);


  useEffect(() => {
    getTemplatesByUserId(localStorage.getItem('userId'))
    .then(response => setData(response.data))
  },[])


  const [update, setupdate] = useState(true);

  function OnAction() {

    setupdate(false);
  }
  function OnAction1() {
    setupdate(true);
  }

  return (
    <div>
      <NavBar2 />
      {update && (
        <>
        
          <div className="Card">
            <div className="Icon">

              {data && <MyTable OnAction={OnAction} data={data} />}

            </div>
          </div>
          <div className="Delimitation">© 2023 INTELLIGENT FORMS</div>
        </>
      )}
      {!update && (
        <div onClick={OnAction1} className="buttonBack">
          <ArrowCircleLeftIcon />
        </div>
      )}
      {!update && <FormActions activeTemplateId={activeTemplateId} />}
    </div>
  );
}

export default Update_Form;
