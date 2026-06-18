class Student:
           def __init__ (self,name,age):
                    self.name=name
                    self.age=age
           def display(self):
                 print ("name:",self.name)
                 print ("age:",self.age)
s1=Student("Arun",22)
s1.display()