package com.folivora.stocks2.controller;


import com.folivora.stocks2.exceptions.NotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("message")
public class MainController {
    private int counter = 4;

    private List<Map<String, String>> messages = new ArrayList<Map<String, String>>(){{
        add(new HashMap<String, String>(){{put("id", "1"); put("date", "11-11-2011"); put("text", "АвтоВаз"); put("price", "2000");}});
        add(new HashMap<String, String>(){{put("id", "2"); put("date", "11-12-2011"); put("text", "КамАЗ"); put("price", "2500");}});
        add(new HashMap<String, String>(){{put("id", "3"); put("date", "22-12-2011"); put("text", "МАЗ"); put("price", "3000");}});
    }};

    @GetMapping
    public List<Map<String, String>> list(){

        return messages;
    }


    @GetMapping("{id}")
    public Map<String, String> getOne(@PathVariable String id) {
        return getMessage(id);
    }


    private  Map<String, String> getMessage(@PathVariable String id){
        return messages.stream()
                .filter(message -> message.get("id").equals(id))
                .findFirst()
                .orElseThrow(NotFoundException::new);
    }


    @PostMapping
    public Map<String, String> create(@RequestBody Map<String,String> message){
        message.put("id", String.valueOf(counter++));
        messages.add(message);
        return message;

    }
    @PutMapping("{id}")
    public Map<String, String> update(@PathVariable String id, @RequestBody Map<String,String> message){
        Map<String, String> messageFromDb = getMessage(id);

        messageFromDb.putAll(message);
        messageFromDb.put("id", id);

        return messageFromDb;


    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable String id) {
        Map<String, String> message = getMessage(id);

        messages.remove(message);
    }



}
