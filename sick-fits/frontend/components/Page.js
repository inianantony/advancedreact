import React from 'react'

export default class Page extends React.Component{
    render(){
        return (
            <div>
                <p> Hey ! I am the page Component</p>
                {this.props.children}
            </div>
        )
    }
}