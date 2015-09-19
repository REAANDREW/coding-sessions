package main

import (
	"testing"
)

func assertEqual(t *testing.T, actual interface{}, expected interface{}) {
	if actual != expected {
		t.Errorf("%v does not equal %v", actual, expected)
	}
}
func assertNotEqual(t *testing.T, actual interface{}, expected interface{}) {
	if actual == expected {
		t.Errorf("%v equals %v", actual, expected)
	}
}

func TestFactorialSucceeds(t *testing.T) {
	assertEqual(t, factorial(5), 120)
}

func TestFactorialFails(t *testing.T) {
	assertNotEqual(t, factorial(5), 1)
}
