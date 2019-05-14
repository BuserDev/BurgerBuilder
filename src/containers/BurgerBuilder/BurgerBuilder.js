import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad:0.5,
    cheese:0.4,
    meat:1.3,
    bacon:0.7
}

class BurgerBuilder extends Component {
    state = {
        ingredients:null,
        totalPrice: 4,
        purchaseable:false,
        purchasing: false,
        loading:false,
        error:false
    }

    componentDidMount(){
        axios.get('https://react-my-burger-89867.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error:true});
                // this.setState({loading:false, purchasing:false});
            });
    }

    updatePurchaseState(currentIngredients){
        const sum = Object.keys(currentIngredients)
            .map(igKey => {
                return currentIngredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);

        this.setState({purchaseable: sum > 0});
    }

    addIngredientHandler = (type) => {
        let currentIngredients = {...this.state.ingredients};
        currentIngredients[type] = currentIngredients[type] + 1;
        let currentPrice = this.state.totalPrice;
        currentPrice += INGREDIENT_PRICES[type];

        this.setState({
            ingredients: currentIngredients,
            totalPrice: currentPrice
        });

        this.updatePurchaseState(currentIngredients);
    }
    removeIngredientHandler = (type) => {
        const currTypeCount = this.state.ingredients[type];
        if(currTypeCount > 0){
            let currentIngredients = {...this.state.ingredients};
            currentIngredients[type] = currTypeCount - 1;
            let currentPrice = this.state.totalPrice;
            currentPrice -= INGREDIENT_PRICES[type];
    
            this.setState({
                ingredients: currentIngredients,
                totalPrice: currentPrice
            });

            this.updatePurchaseState(currentIngredients);
        }
    }

    purchaseHandler = () => {
        this.setState({purchasing:true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }
    
    purchaseContinueHandler = () => {
        //alert('you continue!');
        this.setState({loading:true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer:{
                name: 'bobbo buser',
                address:{
                    street:'311 morgan ave',
                    zipCode: '08065',
                    country: 'USA'
                },
                email:'bip@clash.com'
            },
            deliveryMethod:'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading:false, purchasing:false});
            })
            .catch(error => {
                this.setState({loading:false, purchasing:false});
            });
    }

    render(){
        const disabledInfo = {...this.state.ingredients};
        let orderSummary = null;
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let burger = this.state.error ? <p>Ingredients can't be loaded.</p> : <Spinner/>;
        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls 
                        price={this.state.totalPrice}
                        purchaseable={this.state.purchaseable}
                        ingredientAdded={this.addIngredientHandler} 
                        ingredientRemoved={this.removeIngredientHandler} 
                        disabled={disabledInfo}
                        ordered={this.purchaseHandler}/>
                </Aux>);
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinue={this.purchaseContinueHandler}
                price={this.state.totalPrice}
                />;
        }
        if(this.state.loading){
            orderSummary = <Spinner/>;
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    };
}

export default withErrorHandler(BurgerBuilder, axios);