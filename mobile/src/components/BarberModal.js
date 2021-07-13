import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import Api from '../Api';

import ExpandIcon from '../assets/expand.svg';
import NavPrevIcon from '../assets/nav_prev.svg';
import NavNextIcon from '../assets/nav_next.svg';

const Modal = styled.Modal``;

const ModalArea = styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: flex-end;
`;

const ModalBody = styled.View`
    background-color: #83D6E3;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    min-height: 300px;
    padding: 10px 20px 40px;
`;

const CloseButton = styled.TouchableOpacity`
    width: 40px;
    height: 40px;
`;

const ModalItem = styled.View`
    background-color: #FFF;
    border-radius: 10px;
    margin-bottom: 15px;
    padding: 10px;
`;

const UserInfo = styled.View`
    flex-direction: row;
    align-items: center;
`;

const UserAvatar = styled.Image`
    height: 56px;
    width: 56px;
    border-radius: 20px;
    margin-right: 15px;
`;

const UserName = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #000;
`;

const ServiceInfo = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

const ServiceName = styled.Text`
    font-size: 16px;
    font-weight: bold;
`;

const ServicePrice = styled.Text`
    font-size: 16px;
    font-weight: bold;
`;

const FinishButton = styled.TouchableOpacity`
    background-color: #268596;
    height: 60px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
`;

const FinishButtonText = styled.Text`
    font-size: 17px;
    color: #FFF;
    font-weight: bold;
`;

const DateInfo = styled.View`
    flex-direction: row;
`;

const DatePrevArea = styled.TouchableOpacity`
    flex: 1;
    align-items: flex-end;
`;

const DateTitleArea = styled.View`
    width: 140px;
    justify-content: center;
    align-items: center;
`;

const DateTitle = styled.Text`
    font-size: 17px;
    font-weight: bold;
    color: #000;
`;

const DateNextArea = styled.TouchableOpacity`
    flex: 1;
    align-items: flex-start;
`;

const DateList = styled.ScrollView``;

const DateItem = styled.TouchableOpacity`
    width: 45px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
`;

const DateItemWeekDay = styled.Text`
    font-size: 16px;
    font-weight: bold;
`;

const DateItemNumber = styled.Text`
    font-size: 16px;
    font-weight: bold;
`;

const TimeList = styled.ScrollView``;

const TimeItem = styled.TouchableOpacity`
    width: 75px;
    height: 40px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
`;

const TimeItemText = styled.Text`
    font-size: 16px;
`;


const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
];

const days = [
    'Dom',
    'Seg',
    'Ter',
    'Qua',
    'Qui',
    'Sex',
    'Sab'
];



export default ({ show, setShow, user, service}) => {
    const navigation = useNavigation();

    const [selectedYear, setSelectedYear] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedDay, setSelectedDay] = useState(0);
    const [selectedHour, setSelectedHour] = useState(null);
    const [listDays, setListDays] = useState([]);
    const [listHours, setListHours] = useState([]);

    useEffect(() => {
        if(user.available) {
            let daysInMonth = new Date(selectedYear, selectedMonth+1, 0).getDate(); /**pegando o ultimo dia do mês para ver quantos dias tem no mês*/
            let newListDays = [];

            for(let i=1; i<=daysInMonth; i++) {
                let d = new Date(selectedYear, selectedMonth, i);
                let year = d.getFullYear();
                let month = d.getMonth() + 1;
                let day = d.getDate();
                month = month < 10 ? '0'+month : month;
                day = day < 10 ? '0'+day : day;
                let selDate = `${year}-${month}-${day}`;

                let availability = user.available.filter(e => e.date === selDate);

                newListDays.push({
                    status: availability.length > 0 ? true : false,
                    weekday: days[d.getDay()],
                    number: i
                });
            }

            setListDays(newListDays);
            setSelectedDay(0);
            setListHours([]);
            setSelectedHour(null);
        }

    }, [user, selectedMonth, selectedYear]);


    useEffect(() => {
        if(user.available && selectedDay > 0) {
            let d = new Date(selectedYear, selectedMonth, selectedDay);
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let day = d.getDate();
            month = month < 10 ? '0'+month : month;
            day = day < 10 ? '0'+day : day;
            let selDate = `${year}-${month}-${day}`;

            let availability = user.available.filter(e => e.date === selDate);

            if(availability.length > 0) {
                setListHours(availability[0].hours);
            }
        }

        setSelectedHour(null);

    }, [user, selectedDay]);


    useEffect(() => {
        let today = new Date();
        setSelectedYear(today.getFullYear());
        setSelectedMonth(today.getMonth());
        setSelectedDay(today.getDate());
    },[]);

    const handleLeftDateClick = () => {
        let mountDate = new Date(selectedYear, selectedMonth, 1);
        mountDate.setMonth(mountDate.getMonth() - 1);
        setSelectedYear(mountDate.getFullYear());
        setSelectedMonth(mountDate.getMonth());
        setSelectedDay(0);
    }

    const handleRightDateClick = () => {
        let mountDate = new Date(selectedYear, selectedMonth, 1);
        mountDate.setMonth(mountDate.getMonth() + 1);
        setSelectedYear(mountDate.getFullYear());
        setSelectedMonth(mountDate.getMonth());
        setSelectedDay(0);
    }

    const handleCloseButton = () => {
        setShow(false);
    }

    const handleFinishClick = async () => {
        if(
            user.id && 
            service != null && 
            selectedYear > 0 && 
            selectedMonth > 0 &&
            selectedDay > 0 &&
            selectedHour != null
        ) {
            /*let res = await Api.setAppointment(
                user.id,
                service,
                selectedYear,
                selectedMonth,
                selectedDay,
                selectedHour
            );

            if(res.error == '') {
                setShow(false);
                navigation.navigate('Appointments');
            } else {
                alert(res.error);
            }*/
        
            setShow(false);
            navigation.navigate('Appointments');
        } else {
            alert('Preencha todos os dados');
        }
    }


    return (
        <Modal
            transparent
            visible={show}
            animationType="slide"
        >
            <ModalArea>
                <ModalBody>
                    <CloseButton onPress={handleCloseButton}>
                        <ExpandIcon width="40" heigth="40" fill="#000" />
                    </CloseButton>

                    <ModalItem>
                        <UserInfo>
                            <UserAvatar source={{uri: user.avatar}}/>
                            <UserName>{user.name}</UserName>
                        </UserInfo>
                    </ModalItem>

                    {service != null &&
                        <ModalItem>
                            <ServiceInfo>
                                <ServiceName>{user.services[service].name}</ServiceName>
                                <ServicePrice>R$ {user.services[service].price.toFixed(2)}</ServicePrice>
                            </ServiceInfo>
                        </ModalItem>
                    }

                    <ModalItem>
                        <DateInfo>
                            <DatePrevArea onPress={handleLeftDateClick}>
                                <NavPrevIcon width="35" heigth="35" fill="#000" />
                            </DatePrevArea>
                            <DateTitleArea>
                                <DateTitle>{months[selectedMonth]} {selectedYear}</DateTitle>
                            </DateTitleArea>
                            <DateNextArea onPress={handleRightDateClick}>
                                <NavNextIcon width="35" heigth="35" fill="#000" />
                            </DateNextArea>
                        </DateInfo>
                        <DateList horizontal={true} showsHorizontalScrollIndicator={false}>
                            {listDays.map((item, key)=>(
                                <DateItem 
                                    key={key} 
                                    onPress={()=> item.status ? setSelectedDay(item.number) : null}
                                    style={{ 
                                        opacity: item.status ? 1 : 0.5,
                                        backgroundColor: item.number === selectedDay ? '#4EADBE' : '#FFF'
                                    }}
                                >
                                    <DateItemWeekDay
                                        style={{ 
                                            color: item.number === selectedDay ? '#FFF' : '#000'
                                        }}
                                    >{item.weekday}</DateItemWeekDay>
                                    <DateItemNumber
                                        style={{ 
                                            color: item.number === selectedDay ? '#FFF' : '#000'
                                        }}
                                    >{item.number}</DateItemNumber>
                                </DateItem>
                            ))}
                        </DateList>
                    </ModalItem>

                    {selectedDay > 0 && listHours.length > 0 &&
                        <ModalItem>
                            <TimeList horizontal={true} showsHorizontalScrollIndicator={false}>
                                {listHours.map((item, key)=> (
                                    <TimeItem
                                        key={key}
                                        onPress={()=>setSelectedHour(item)}
                                        style={{
                                            backgroundColor: item === selectedHour ? '#4EADBE' : '#FFF'
                                        }}
                                    >
                                        <TimeItemText
                                            style={{
                                                color: item === selectedHour ? '#FFF' : '#000',
                                                fontWeight: item === selectedHour ? 'bold' : 'normal'
                                            }}
                                        >{item}</TimeItemText>
                                    </TimeItem>
                                ))}
                            </TimeList>
                        </ModalItem>
                    }

                    <FinishButton onPress={handleFinishClick}>
                        <FinishButtonText>Finalizar Agendamento</FinishButtonText>
                    </FinishButton>
                </ModalBody>
            </ModalArea>
        </Modal>
    );
}