import React, {Component} from 'react';
import classes from './Layout.css';
import Aux from '../../hoc/Aux';
import Toolbar from '../Navigation/Toolbar/Toolbar.js';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

class Layout extends Component{
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer:false});
    }

    sideDrawerOpenHandler = () => {
        this.setState((prevState) => {
            return {showSideDrawer:!prevState.showSideDrawer}
        });
    }

    render(){
        return (
            <Aux>
                <Toolbar toggleSideDrawer={this.sideDrawerOpenHandler}/>
                <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler} />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }

}

export default Layout;