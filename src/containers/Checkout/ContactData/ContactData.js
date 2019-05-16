import React, { Component } from 'react';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

import Button from '../../../components/UI/Button/Button';

class ContactData extends Component {
    state = {
        orderForm:{
            name: {
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Your name'
                },
                value:'',
                validation:{
                    required:true,

                },
                valid:false,
                touched:false
            },
            street:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Street'
                },
                value:'',
                validation:{
                    required:true,
                    
                },
                valid:false,
                touched:false
            },
            zipCode: {
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Zip Code'
                },
                value:'',
                validation:{
                    required:true,
                    minLength:5,
                    maxLength:5
                    
                },
                valid:false,
                touched:false
            },
            country: {
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Country'
                },
                value:'',
                validation:{
                    required:true,
                    
                },
                valid:false,
                touched:false
            },
            email:{
                elementType:'email',
                elementConfig:{
                    type:'text',
                    placeholder:'Your E-Mail'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            deliveryMethod:{
                elementType:'select',
                elementConfig:{
                    options:[{value:'fastest', displayValue:'Fastest'},
                        {value:'cheapest', displayValue:'Cheapest'}]
                },
                validation:{},
                value:'fastest',
                valid:true
            }
        },
        formIsValid: false,
        loading:false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading:true});

        const formData = {};
        for (let formElId in this.state.orderForm){
            formData[formElId] = this.state.orderForm[formElId].value;
        }

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData:formData
        }
        axios.post('/orders.json', order)
            .then(response => {
                // console.log('success');
                this.setState({loading:false});
                this.props.history.push('/');
            })
            .catch(error => {
                // console.log(error);
                this.setState({loading:false});
            });
        
    }

    checkValidity(value, rules){
        let isValid = true;
        // if(rules){
            if(rules.required){
                isValid = value.trim() !== '' && isValid;
            }
    
            if(rules.minLength && isValid){
                isValid = value.length >= rules.minLength && isValid;
            }
    
            if(rules.maxLength && isValid){
                isValid = value.length <= rules.maxLength && isValid;
            }
        //}

        return isValid;
    }

    inputChanged = (event, inputIdentifier) => {
        const updatedOrderForm = {...this.state.orderForm};
        const updateFormElement = {...updatedOrderForm[inputIdentifier]};
        updateFormElement.value = event.target.value;
        updateFormElement.valid = this.checkValidity(updateFormElement.value, updateFormElement.validation)
        updateFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updateFormElement;
        //console.log(updateFormElement)
        let formIsValid = true;
        for(let inputId in updatedOrderForm){
            formIsValid = (updatedOrderForm[inputId].valid && formIsValid);
        }

        this.setState({orderForm:updatedOrderForm, formIsValid:formIsValid});
    }

    render() {
        const formElementsArray = [];
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id:key,
                config:this.state.orderForm[key]
            });
        }
        let form = (<form onSubmit={this.orderHandler}>
                        {formElementsArray.map(element => (
                            <Input 
                                key={element.id} 
                                elementType={element.config.elementType} 
                                elementConfig={element.config.elementConfig} 
                                value={element.value}
                                invalid={!element.config.valid}
                                shouldValidate={element.config.validation}
                                touched={element.config.touched}
                                changed={(event) => this.inputChanged(event, element.id)}/>))}
                        <Button disabled={!this.state.formIsValid} btnType="Success">Order</Button>
                    </form>);
        if (this.state.loading){
            form = <Spinner/>
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;