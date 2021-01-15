import React, {useState, useEffect, useMemo} from 'react';
import {ResourcePicker, TitleBar} from '@shopify/app-bridge-react';
import axios from 'axios'
import {Button, TextField, Select,TextContainer} from '@shopify/polaris';


function Finder({shopOrigin, accessToken, type, setHref, href, edit, settedHref}) {
    
    const [buttonValue,setButtonValue] = useState();
    const [open, setOpen] = useState(false);
    const [pages, setPages] = useState();
    const [blogs, setBlogs] = useState([]);
    const [activeBlog, setActiveBlog] = useState();
    const [articles, setArticles] = useState();
    const [activeArticle, setActiveArticle] = useState();
    const [change, setChange] = useState(false);

    useEffect(()=>{
        if(buttonValue) setButtonValue("")
        if(!edit && href) setHref("")
        if(type === "blog" && blogs && blogs[0]){
            setActiveBlog(blogs[0].id + "," + blogs[0].handle)
        }
        if(type==="page" ){
            if(pages && pages[0]){
                const value = pages[0].title.toLowerCase().split(" ").join("-")
                setHref(`https://${shopOrigin}/pages/${value}`)
            }
        }
    },[type]);

    useEffect(()=>{
        const obj = {
            domain: shopOrigin,
            accessToken
        }
        //FETCH BLOGS
        axios.post('/api/v1/request/blog',obj)
        .then(res => {
            const storeBlogs = res.data.response.blogs
            setBlogs(storeBlogs);
            if(storeBlogs.length > 0){
                setActiveBlog(storeBlogs[0].id + "," + storeBlogs[0].handle)
            }
        })
        .catch(err => console.log("some error has occured"))

        // FETCH PAGES
        axios.post('/api/v1/request/page',obj)
        .then(res => setPages(res.data.response.pages))
        .catch(err => console.log("some error has occured"))
    },[]);

    useEffect(()=>{  
        if(activeBlog){       
            const data ={
                domain: shopOrigin,
                accessToken,
                blogId: activeBlog.split(",")[0]
            }
            axios.post('/api/v1/request/articles',data)
                .then(res => {
                    setArticles(res.data.response.articles);
                    if(res.data.response.articles && res.data.response.articles[0]){
                        if(!edit) setActiveArticle(res.data.response.articles[0].handle)
                        if(change){
                            setHref(`https://${shopOrigin}/blogs/${activeBlog.split(",")[1]}/${res.data.response.articles[0].handle}`);
                        }
                    }
                })
                .catch(err => console.log("some error has occured"))
        }
    },[activeBlog]);

    // LINK TYPE
    let blogOptions;
    let articleOptions;
    let pageOptions;
    if(blogs){
        blogOptions = [
            blogs.map(blog => {
                return(
                    {
                        label: blog.title,
                        value: blog.id + "," + blog.handle
                    }
                )
            })
        ]
    }
    if(articles){
        articleOptions = [
            articles.map((article) => {
                return(
                    {
                        label: article.title.split(/\s+/).slice(0,5).join(" ") + "...",
                        value: article.handle
                    }
                )
            })
            
        ];
    }

    if(pages){
        pageOptions = [
            pages.map((page,i)=> {
                return(
                    {
                        label: page.title,
                        value: page.handle
                    }
                )
            })
            
        ];
    }
    const handleSelection = (resources) => {
        let title = resources.selection[0].handle
        const name = title.split("-").join(" ");
        setButtonValue(name)
        let url;
        if(open === "product") url = `https://${shopOrigin}/products/${title}`
        if(open === "collection") url = `https://${shopOrigin}/collections/${title}`
        setHref(url)
        setOpen(false)
    }
    const handleArticles = (value) => {
        setHref(`https://${shopOrigin}/blogs/${activeBlog.split(",")[1]}/${value}`)
        setActiveArticle(value)
    }
    if(!pages || !blogs){
        return(
            <div style={{marginTop:"20px"}}>
                <Button loading />
            </div>
        )
    }
    return (
        <div className="finder_buttons">
            {
                type === "product" ? 
                <Button fullWidth onClick={()=> setOpen("product")} >
                    {edit && !buttonValue ? 'Product:' + ' ' + settedHref.split("/")[settedHref.split("/").length -1].split('-').join(" ")
                    :buttonValue || "Select Product"}
                </Button> :
                type === "collection" ?
                <Button fullWidth onClick={()=> setOpen("collection")} >
                    {edit && !buttonValue ? 'Collection' + ' ' +  settedHref.split("/")[settedHref.split("/").length -1].split('-').join(" ")
                    :buttonValue || "Select Collection"}
                </Button> :

                type === "blog" ?
                blogs && 
                    <Select
                        style={{width:'100%'}}
                        label="Select Blog"
                        options={blogOptions[0]}
                        value={activeBlog}
                        onChange={(value) => {
                            setChange(true);
                            setActiveBlog(value);
                        }}
                    />
                :
                type === "page" ?
                pages && edit ? 
                <Select
                    label="Select Page"
                    options={pageOptions[0]}
                    value={settedHref.split("/")[settedHref.split("/").length -1]}
                    onChange={(value) => setHref(`https://${shopOrigin}/pages/${value}`)}
                />
                :
                <Select
                    label="Select Page"
                    options={pageOptions[0]}
                    value={href.split("/")[href.split("/").length -1]}
                    onChange={(value) => setHref(`https://${shopOrigin}/pages/${value}`)}
                /> :
                <TextField
                    id="other_id"
                    label="Link Address"
                    onChange={(value)=> setHref(value)}
                    value={href}
                    placeholder="Starts With http:// or https://"/>
            }
            {
                open && <ResourcePicker
                resourceType="Collection"
                allowMultiple={false}
                showVariants={false}
                open={open === "collection" ? true : false}
                onSelection={(resources) => handleSelection(resources)}
                onCancel={() => setOpen(false)}
                />
            }
            {
                open && <ResourcePicker
                resourceType="Product"
                allowMultiple={false}
                showVariants={false}
                open={open === "product" ? true: false}
                onSelection={(resources) => handleSelection(resources)}
                onCancel={() => setOpen(false)}
            />
            }
            {
                activeBlog && type === "blog" && articleOptions &&
                <div style={{marginTop:"20px", width:"100%"}}>
                    {!edit &&    <Select
                    label="Post "
                    labelInline
                    options={articleOptions[0]}
                    value={activeArticle}
                    onChange={(value) => handleArticles(value)}
                    /> }
                    {
                        edit && <Select
                        label="Posts "
                        labelInline
                        options={articleOptions[0]}
                        value={activeArticle || settedHref.split('/')[settedHref.split('/').length - 1]}
                        onChange={(value) => handleArticles(value)}
                        />
                    }
                </div>
            }
        </div>
    )
}
export default Finder;
