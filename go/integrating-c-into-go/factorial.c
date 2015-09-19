int factorial(int i){
	int total = 1;
	int counter;
	for(counter = i; counter > 0; counter--){
		total *= counter;
	}
	return total;
}
