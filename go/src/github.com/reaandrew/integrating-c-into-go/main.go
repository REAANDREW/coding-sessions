package main

import (
	"fmt"
	"os"
	"strconv"
)

/*
#cgo CFLAGS: --std=gnu11

int factorial(int value);
*/
import "C"

func assert(value bool, message string) {
	if !value {
		panic(message)
	}
}

func factorial(input int) (result int) {
	cInput := C.int(input)
	result = int(C.factorial(cInput))
	return
}

func main() {
	arg := os.Args[1]
	input, err := strconv.Atoi(arg)
	if err != nil{
		panic("You must supply an integer as the first argument")
	}
	result := fmt.Sprintf("%d! = %d", input, factorial(input))
	fmt.Println(result)
}
