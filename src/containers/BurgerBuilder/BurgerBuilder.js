import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
    salad:0.5,
    cheese:0.4,
    meat:1.3,
    bacon:0.7
}

class BurgerBuilder extends Component {
    state = {
        ingredients:{
            salad:0,
            bacon:0,
            cheese:0,
            meat:0
        },
        totalPrice: 4,
        purchaseable:false,
        purchasing: false
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
        alert('you continue!');
    }

    render(){
        const disabledInfo = {...this.state.ingredients};
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        return (
            <Aux>
            <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                <OrderSummary 
                    ingredients={this.state.ingredients}
                    purchaseCanceled={this.purchaseCancelHandler}
                    purchaseContinue={this.purchaseContinueHandler}
                    price={this.state.totalPrice}
                     />
            </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls 
                    price={this.state.totalPrice}
                    purchaseable={this.state.purchaseable}
                    ingredientAdded={this.addIngredientHandler} 
                    ingredientRemoved={this.removeIngredientHandler} 
                    disabled={disabledInfo}
                    ordered={this.purchaseHandler}/>
            </Aux>
        );
    };
}

export default BurgerBuilder