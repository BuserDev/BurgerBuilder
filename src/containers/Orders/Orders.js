import React, { Component } from 'react';
import axios from '../../axios-orders';
import Order from './Order/Order';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
    state = {
        orders:[],
        loading:true
    }
    componentDidMount(){
        axios.get('/orders.json')
            .then(res => {
                const fetchedOrders = [];
                for(let key in res.data){
                    fetchedOrders.push({
                        ...res.data[key],
                        id:key
                    });
                }
                console.log('success');
                this.setState({loading:false, orders:fetchedOrders});
            })
            .catch(err => {
                console.log('error');
                this.setState({loading:false});
            });
    }


    render() {
        console.log('render');
        let orders = <Spinner/>;
        if(!this.state.loading){
            orders = this.state.orders.map(order => (<Order key={order.id} ingredients={order.ingredients} price={+order.price}/>));
        }
        return (
            <div>
                {orders}
            </div>
        );
    }
}

export default withErrorHandler(Orders, axios);