import React, { useEffect, useState, useCallback } from "react";
import { HistoryCard } from "../../components/HistoryCard";
import { categories } from "../../utils/categories";
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  SelectIcon,
  Mouth,
  LoadContainer,
} from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { addMonths, format, subMonths } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/core";
import { useAuth } from "../../contexts/AuthContext";
interface Transaction {
  category: string;
  date: string;
  id: string;
  name: string;
  preco: number;
  transactionType: "up" | "down";
}
interface CategoryData {
  id: string;
  name: string;
  color: string;
  amount: number;
  amountFormatted: string;
  percentage: string;
}

export function Resume() {
  const theme = useTheme();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [totalByCategory, setTotalByCategory] = useState<CategoryData[]>([]);
  const [selectDate, setSelectedDate] = useState(new Date());

  function formatToCurrencyBrl(amount: number) {
    return Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  }

  function handleChangeDate(action: "next" | "previous") {
    if (action === "next") {
      setSelectedDate(addMonths(selectDate, 1));
    } else {
      setSelectedDate(subMonths(selectDate, 1));
    }
  }
  async function loadData() {
    setIsLoading(true);
    const datakey = `@myfinances:transactions_user:${user.id}`;
    console.log({ datakey });
    const transactions: Transaction[] = await AsyncStorage.getItem(
      datakey
    ).then((data) => {
      if (data) {
        return JSON.parse(data);
      }
      return [];
    });
    const expansives = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const isSameMonth = transactionDate.getMonth() === selectDate.getMonth();
      const isSameYear =
        transactionDate.getFullYear() === selectDate.getFullYear();
      return (
        transaction.transactionType === "down" && isSameMonth && isSameYear
      );
    });
    const expansivesTotal = expansives.reduce((acc, t) => {
      return acc + Number(t.preco);
    }, 0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;
      expansives.forEach((expansive) => {
        if (expansive.category === category.key) {
          categorySum += expansive.preco;
        }
      });
      if (categorySum > 0) {
        const percentage = ((categorySum * 100) / expansivesTotal).toFixed(2);
        totalByCategory.push({
          id: category.key,
          name: category.name,
          color: category.color,
          amountFormatted: formatToCurrencyBrl(categorySum),
          amount: categorySum,
          percentage: percentage + "%",
        });
      }
    });
    setTotalByCategory(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator
            color={theme.colors.primary}
            size="large"
          ></ActivityIndicator>
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleChangeDate("previous")}>
              <SelectIcon name="chevron-left" />
            </MonthSelectButton>
            <Mouth>{format(selectDate, "MMMM, yyyy", { locale: ptBR })}</Mouth>
            <MonthSelectButton onPress={() => handleChangeDate("next")}>
              <SelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>
          <ChartContainer>
            <VictoryPie
              data={totalByCategory}
              x="percentage"
              y="amount"
              colorScale={totalByCategory.map((c) => c.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: "bold",
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={50}
            />
          </ChartContainer>
          {totalByCategory.map((category) => {
            return (
              <HistoryCard
                key={category.id}
                title={category.name}
                color={category.color}
                amount={category.amountFormatted}
              />
            );
          })}
        </Content>
      )}
    </Container>
  );
}
