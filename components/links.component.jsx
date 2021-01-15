import React, {useState, useEffect} from 'react';
import {Select, Frame, Loading, Button} from '@shopify/polaris';
import axios from 'axios';
import LinkModal from './linkModal.component';

function LinkCard(props) {
    const[icons, setIcons] = useState();
    const[values, setValues] = useState();
    const[filterValue, setFilterValue] = useState('');
    const [active, setActive] = useState(false);
    const [editIcon, setEditIcon] = useState(false);
    const [fetch, setRefetch] = useState(false);
    const [newicon, setNewIcon] = useState(false);
    const [orderbutton, setOrderButton] = useState(false);
    const [loading, setLoading] = useState(false)
    
    const refetch= () =>{
        setRefetch(!fetch)
    }
    const handleChange = () =>{
        setActive(!active)
    };

    const sortIcon = (index, type) => {
        // Reordering
        Array.prototype.move = function(from,to){
            this.splice(to,0,this.splice(from,1)[0]);
            return this;
        };
        let array;
        if(type==="up")array = icons.move(index,index - 1)
        if(type==="down")array = icons.move(index,index + 1)
        setIcons(array)
        setNewIcon(!newicon)
        if(!orderbutton){
            setOrderButton(true)
        }
    }
    const saveOrder = () => {
        if(icons.length === 0) return setOrderButton(false)
        icons.map((icon, i) => {
            const obj={
                order: i
            }
            axios.patch(`/api/v1/icon/${icon._id}`,obj)
            .then(res => {
                if(i === icons.length -1){
                    alert("order updated");
                    setLoading(false)
                    setOrderButton(false)
                }
            })
            .catch(err => console.log("some error has occured"))
        })
    }

    useEffect(()=>{
            const url = `/api/v1/icon/${props.hostId}`
            axios.get(url)
            .then(res => {
                let icons = res.data.icons;
                if(icons && icons.length>0){
                    icons = icons.sort(function(a, b) { 
                        return a.order - b.order
                    });
                }
                setIcons(icons)
            })
            .catch(err => console.log("some error has occured"))
    
    },[values, fetch, props.icon])

    const handleAction = (value, id, imageKey, icon) => {
        if(value === 'edit'){
            setEditIcon(icon)
            handleChange()
            return
        }
        let obj;
        const url = `/api/v1/icon/${id}/${imageKey}`
        if(value === 'disable'){
            obj={
                enabled: false
            }
            axios.patch(`/api/v1/icon/${id}`,obj)
            .then(res => setValues(res))
            .catch(err => console.log("some error has occured"))
            return
        }
        if(value === 'enable'){
            obj={
                enabled: true
            }
            axios.patch(`/api/v1/icon/${id}`,obj)
            .then(res => setValues(res))
            .catch(err => console.log("some error has occured"))
            return
        }
        if(value === 'delete',{hostId: props.hostId}){
            axios.delete(url)
            .then(res => setValues(res))
            .catch(err => console.log("some error has occured"))
            return
        }
    }
    
    const handleFilter = (value) => {
        setFilterValue(value);
    }
    const actionOptions = [
        {label: 'Action', value: ''},
        {label: 'Edit', value: 'edit'},
        {label: 'Enable', value: 'enable'},
        {label: 'Disable', value: 'disable'},
        {label: 'Delete', value: 'delete'}
    ];
    const filterOptions = [
        {label: 'All Links', value: ''},
        {label: 'Product', value: 'product'},
        {label: 'Collection', value: 'collection'},
        {label: 'Page', value: 'page'},
        {label: 'Blog', value: 'blog'},
        {label: 'Other', value: 'other'}
    ];

      if(icons){
        return (
            <div id="table">
                <div className="sorting">
                    <p><i className="fas fa-filter"></i></p>
                <Select options={filterOptions} value={filterValue}
                    onChange={(value)=> handleFilter(value)} />
                </div>
                <table className="dataTable">
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Icon</th>
                            <th>Type</th>
                            <th>Label</th>
                            <th>Status</th>
                            <th style={{textAlign:'center'}}>Action</th>
                            <th><i className="fas fa-sort"></i></th>
                            
                        </tr>
                    </thead>    
                    <tbody>
                    {
                            icons.map((icon,i)=>{
                                if(props.widget.plan === "free" && i>1){
                                    return
                                }
                                if(filterValue && filterValue.length >0){
                                    if(icon.iconType !== filterValue){
                                        return
                                    }
                                }
                                return(
                                    <tr key={i}>
                                        <td>{i+1}</td>
                                        <td >
                                            {icon.type === 'image'?
                                            <img style={{backgroundColor:`${icon.background}`}} src={icon.iconImage} alt={icon.iconHref} />:
                                            <div className="image" style={{backgroundColor:`${icon.background}`, color:`${icon.color}`}}>
                                                <i className={icon.iconLinkName}></i>
                                            </div>
                                            }
                                        </td>
                                        <td>{icon.iconType}</td>
                                        <td>{icon.iconLabel}</td>
                                        <td>
                                            {icon.enabled ? 'Enabled': 'Disabled'} 
                                        </td>
                                        <td>
                                        <Select options={actionOptions}
                                            onChange={(value)=> handleAction(value, icon._id, icon.iconKey, icon)} />
                                        </td>
                                        <td className="order_icons" style={{fontSize:"17px"}}>
                                            {
                                                i > 0 && 
                                                <div className="upi" onClick={(e)=> sortIcon(i, "up")}>
                                                  <i className="fas fa-caret-up"></i>
                                                </div>
                                            }
                                            {
                                                i < icons.length -1 &&
                                                <div className="downi" onClick={(e)=> sortIcon(i, "down")}>
                                                   <i className="fas fa-caret-down"></i>
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                
                                )
                            })
                        // ))
                    }
                    </tbody>
                </table>
                <div className="order_save">
                    {
                        loading ? <Button disabled>updating.. .</Button> :orderbutton ? <Button primary onClick={()=> {saveOrder();setLoading(true)}}>Save</Button> : <Button disabled>Save</Button>
                    }
                </div>
                <div style={{position:'absolute'}}>
                {editIcon && 
                <LinkModal 
                    handleChange={handleChange} 
                    active={active} 
                    setActive={setActive}
                    icon={editIcon} 
                    hostId={props.hostId}
                    refetch={refetch}
                    accessToken={props.accessToken}
                    />
                }
                </div>
            </div>
            
        )
      }else{
          return(
            <div style={{height: '500px'}}>
                <Frame>
                    <Loading />
                </Frame>
            </div>
          )
      }
};

export default LinkCard;
