ScenarioBuilder.new.scenario do
  create_screen do
    template :start
  end

  create_screen do
    template :how_many_people

    create_question do
      type SingleChoiceQuestion
      title "How many people live in Africa?"
      introduction "Africa is the second most populous continent on the globe, with about 16% of the world’s population."
      points 200
      options '1.2 billion', '3.1 billion', '702 million', '443 million'
      right_options '1.2 billion'
      hint "The population of Africa is growing fast: According to the UN, more than half of global population growth between 2015 and 2050 is expected to occur in Africa."
    end
  end

  create_screen do
    template :how_many_people_live_less_2_dollars

    create_question do
      type SingleChoiceQuestion
      title "How many people in Africa live on less than $2 a day?"
      introduction "Africa is rich in natural resources, but it is still home to the majority of the world’s least developed countries."
      points 200
      options '57%', '43%', '31%', '21%'
      right_options '43%'
      hint "Although the proportion of people living in poverty has improved in recent years, statistics don’t capture the widening inequality gap as Africa’s elite minority grows in numbers and in wealth."
    end
  end

  create_screen do
    template :how_many_countries

    create_question do
      type SingleChoiceQuestion
      title "How many countries are there in Africa?"
      introduction "Africa has more countries than any other continent in the world."
      points 200
      options 38, 49, 54, 62
      right_options 54
      hint "Africa is the world’s second-largest continent in terms of size, and is world’s oldest populated area."
    end
  end

  create_screen do
    template :how_many_countries_home_offshore

    create_question do
      type Slider
      title "How many of Africa’s 54 countries were home to offshore companies mentioned in the Panama Papers?"
      points 200
      options 10, 54
      right_options 52
      hint "We found businesses from almost every country in Africa using offshore companies in the Panama Papers, including nearly 7,000 records of shareholders and company owners linked to the continent."
    end
  end

  create_screen do
    template :how_much_know_about_offshore

    create_question do
      type Slider
      title "About how much money does international tourism contribute to Africa’s economy (2015)?"
      points 200
      options 30_000_000_000, 50_000_000_000
      right_options 47_000_000_000
      hint "This would buy you about 5 million first-class return flights from New York to Cape Town"
    end

    create_question do
      type Slider
      title "About how much does the oil industry contribute to Africa’s economy (oil rents as a percentage of GDP in 2013)?"
      points 200
      options 1, 20
      right_options 6
      hint "Oil accounted for about 3% of the entire world’s GDP in 2013"
    end

    create_question do
      type Slider
      title "About how much are diamond exports from Africa worth (2015)?"
      points 200
      options 5_000_000_000, 20_000_000_000
      right_options 9_000_000_000
      hint "The average export price for 1 carat of African rough diamond was $125"
    end
  end

  create_screen do
    template :safaris_map

    create_question do
      title "Tourists in, wealth funneled out"
      type MultipleChoiceQuestion
      points 500
      right_options ['Swaziland', 'South Africa', 'Namibia', 'Zambia', 'Kenya', 'Egypt', 'Zimbabwe', 'Tanzania', 'Botswana']
      hint "Experts say that taxes paid by the tourism industry are hard to police because it’s almost impossible to agree on the exact value of what they’re selling."
    end
  end

  create_screen do
    template :safaris_wildcard

    create_question do
      title "How does it work?"
      type SingleChoiceQuestion
      points 300
      options 'Zimbabwe; British Virgin Islands; Isle of Man', 'Tanzania; Australia; Switzerland', 'Kenya; Mauritius; Spain'
      right_options 'Zimbabwe; British Virgin Islands; Isle of Man'
      hint 'The Panama Papers included many more safari businesses with offshore companies and bank accounts in countries like Switzerland, Mauritius, Liechtenstein, Luxembourg and more.'
    end
  end

  create_screen do
    template :oil_map

    create_question do
      title "Oil riches taken out of Africa"
      type MultipleChoiceQuestion
      points 500
      right_options ['Republic of Congo', 'Libya', 'Nigeria', "Cote d’Ivoire", 'Mozambique', 'Togo', 'Ghana', 'South Sudan', 'Sudan', 'Uganda', 'Tunisia', 'Algeria']
      hint "The reliance of many African countries on oil, which in some cases accounts for 95% of exports, makes these countries vulnerable to illicit financial flows."
    end
  end

  create_screen do
    template :oil_wildcard

    create_question do
      title "Why set up an offshore company?"
      type MultipleChoiceQuestion
      points 300
      options 'TAXES', 'SHELL COMPANIES', 'NOT BEING SUBJECT', 'TAX HAVENS', 'SOLE OBJECT'
      right_options ['0|SHELL COMPANIES', '1|TAX HAVENS', '2|SOLE OBJECT', '3|NOT BEING SUBJECT', '4|TAXES']
    end
  end

  create_screen do
    template :diamond_map

    create_question do
      title "Jewels of the offshore industry"
      type MultipleChoiceQuestion
      points 500
      right_options ['Guinea', 'Sierra Leone', 'Liberia', 'Democratic Republic of the Congo', 'Lesotho']
      hint "Studies have found close links between countries in Africa with big mining sectors and higher levels of inequality."
    end
  end

  create_screen do
    template :final_africa_map
  end

  create_screen do
    template :results
  end

  create_screen do
    template :ranking
  end
end
